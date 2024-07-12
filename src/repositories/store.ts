import { Store } from "@medusajs/medusa"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
  UserRepository as MedusaUserRepository,
} from "@medusajs/medusa/dist/repositories/user"

export const StoreRepository = dataSource
  .getRepository(Store)
  .extend({
    ...Object.assign(
      MedusaUserRepository, 
      { target: Store }
    ),
  })

export default StoreRepository