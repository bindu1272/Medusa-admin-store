import { Lifetime } from "awilix"
import { 
  AuthService as MedusaAuthService, UserService
} from "@medusajs/medusa"
import { User } from "../models/user"
import { 
  CreateUserInput as MedusaCreateUserInput,
} from "@medusajs/medusa/dist/types/user"
import StoreRepository from "../repositories/store"
import { AuthenticateResult } from "../types/auth"
import Scrypt from "scrypt-kdf"
import TokenService from "./token";

type CreateUserInput = {
  store_id?: string
} & MedusaCreateUserInput

class AuthService extends MedusaAuthService {
  static LIFE_TIME = Lifetime.SCOPED
  protected loggedInUser_: User | null = null
  protected readonly storeRepository_: typeof StoreRepository
  protected readonly authService_: AuthService
  protected readonly userService_: UserService
  protected tokenService_: TokenService 

  constructor(container, options) {
    super(container)
    this.storeRepository_ = container.storeRepository
    this.userService_ = container.userService
    this.tokenService_ = container.tokenService
  }

  protected async comparePassword_(
    password: string,
    hash: string
  ): Promise<boolean> {
    const buf = Buffer.from(hash, "base64")
    console.log("Buffer from hash:", buf);
    return Scrypt.verify(buf, password)
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const userPasswordHash: User = await this.userService_
          .withTransaction(transactionManager)
          .retrieveByEmail(email, {
            select: ["password_hash"],
          })
          console.log("Retrieved user password hash:", userPasswordHash.password_hash);
        const passwordsMatch = await this.comparePassword_(
          password,
          userPasswordHash.password_hash
        )
        console.log("email123", email, password,passwordsMatch,userPasswordHash.password_hash)

        // if (passwordsMatch) {
          const user = await this.userService_
            .withTransaction(transactionManager)
            .retrieveByEmail(email)
          // const signToken = this.tokenService_.signToken(JSON.stringify(user))
          // console.log("signToken", signToken)
          // const options: VerifyOptions = {
          //   algorithms: ['HS256'], 
          //   issuer: 'your_issuer', 
          // }
          // this.tokenService_.verifyToken(signToken, options)
          // this.__container__.loggedInUser = user
          console.log("user12", user)
          this.loggedInUser_ = user;
          console.log("user", user, this.loggedInUser_)

          return {
            success: true,
            user: user,
          }
        // }
      } catch (error) {
        console.log("error ->", error)
      }

      return {
        success: false,
        error: "Invalid email or password",
      }
    })
  }

  async authenticateAPIToken(token: string): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const user: User = await this.userService_
          .withTransaction(transactionManager)
          .retrieveByApiToken(token)
        this.loggedInUser_ = user

        console.log("user", user, token, this.loggedInUser_)
        return {
          success: true,
          user,
        }
      } catch (error) {
        return {
          success: false,
          error: "Invalid API Token",
        }
      }
    })
  }
}

export default AuthService
