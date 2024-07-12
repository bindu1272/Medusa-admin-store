import { Invite } from "@medusajs/medusa"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
  InviteRepository as MedusaInviteRepository,
} from "@medusajs/medusa/dist/repositories/invite"


export const InviteRepository = dataSource
  .getRepository(Invite)
  .extend({
    ...Object.assign(
        MedusaInviteRepository, 
      { target: Invite }
    ),
  })

export default InviteRepository