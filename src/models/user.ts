import { 
    Column,
    Entity,
    Index,
    JoinColumn,
  } from "typeorm"
  import {
    User as MedusaUser,
  } from "@medusajs/medusa"
  import { Store } from "@medusajs/medusa"


  export enum UserRoles {
    ADMIN = "admin",
    MEMBER = "member",
    DEVELOPER = "developer",
  }
  
  @Entity()
  export class User extends MedusaUser {
    @Index("UserStoreId")
    @Column({default:""})
    store_id: string
  
    // @ManyToOne(() => Store, (store) => store.members)
    @JoinColumn({ name: "store_id", referencedColumnName: "id" })
    store?: Store
  }