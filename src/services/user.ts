import { EntityManager } from "typeorm";
import { User } from "../models/user";
import { CurrencyRepository } from "../repositories/currency";
import { UserRepository } from "../repositories/user";
import { InviteRepository } from "../repositories/invite";
import { UserService as MedusaUserService } from "@medusajs/medusa";
import Scrypt from "scrypt-kdf";
import { UserRoles, buildQuery } from "@medusajs/medusa";
import { decodeToken, isExpired } from "react-jwt";

type InjectedDependencies = {
  manager: EntityManager;
  userRepository: typeof UserRepository;
  inviteRepository: typeof InviteRepository;
};
class UserService extends MedusaUserService {
  protected readonly userRepository_: typeof UserRepository;
  protected readonly inviteRepository_: typeof InviteRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.userRepository_ = container.userRepository;
    this.inviteRepository_ = container.inviteRepository;
  }

  async createUser(data: {
    First_Name: string;
    Last_Name: string;
    Email: string;
    Password: string;
    Store_Id: string;
    Role: UserRoles;
  }): Promise<User> {
    console.log("serv**", data);
    return this.atomicPhase_(async (manager) => {
      const user = manager.withRepository(this.userRepository_);
      const post = user.create();
      post.first_name = data.First_Name;
      post.last_name = data.Last_Name;
      post.email = data.Email;
      // post.password_hash = data.Password;
      post.store_id = data.Store_Id;
      post.role = data?.Role;
      const keyBuf = await Scrypt.kdf(data?.Password, {
        logN: 15,
        r: 8,
        p: 1,
      });
      const keyStr = keyBuf.toString("base64");
      post.password_hash = keyStr;
      console.log("post", post);
      const result = await user.save(post);
      const columnUpdate = {
        accepted: true,
      };
      const invite = manager.withRepository(this.inviteRepository_);
      const inviteUpdateResult = await invite.update(
        { user_email: data.Email },
        columnUpdate
      );
      console.log("inviteUpdateResult", inviteUpdateResult);
      return result;
    });
  }

  async createNewUserByStore(data) {
    let token: {
      user_email: string;
      role: UserRoles;
      invite_id: string;
      store_id: string;
    } | null = null;

    // if (isExpired(data?.token)) {
    //   return { success: false, message: "Token Expired" }
    // }
    if (data?.token) {
      try {
        token = decodeToken(data?.token as string);
      } catch (e) {
        token = null;
        console.log("exception: ", e);
      }
    }

    console.log("token : ", token);
    // const query = buildQuery({"id": token?.invite_id})
    // console.log("query",query);
    // const invite = await this.inviteRepository_.findOne(query)
    // console.log("invite123",invite);
    const storeId = token?.store_id;
    console.log("storeId123", storeId, data);

    // if (data?.password != data?.confirmPassword) {
    //   return { success: false, message: "Passwords are not matching" }
    // }
    const keyBuf = await Scrypt.kdf(data?.Password, {
      logN: 15,
      r: 8,
      p: 1,
    });
    const keyStr = keyBuf.toString("base64");
    console.log("keyStr", keyStr);

    const senderData = {
      Email: data?.Email,
      Password: keyStr,
      Role: data?.Role,
      First_Name: data?.First_Name,
      Last_Name: data?.Last_Name,
      Store_Id: data?.Store_Id,
    };

    this.createUser(senderData);

    // const user = await this.retrieve("n151272@rguktn.ac.in");

    // const keyBuf1 = Buffer.from(user.password_hash, 'base64');
    // const ok = await Scrypt.verify(keyBuf1, "123123");
    // console.log("ok", ok)

    return { success: true, message: "Successfully Created" };
  }
}

export default UserService;
