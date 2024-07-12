import { Customer, User } from "@medusajs/medusa"

export type AuthenticateResult = {
  success: boolean
  user?: User
  customer?: Customer
  error?: string
}