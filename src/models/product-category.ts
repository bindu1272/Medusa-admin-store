import { 
    Column,
    Entity,
    Index,
    JoinColumn,
    Tree,
    TreeParent,
    TreeChildren,
    Relation
  } from "typeorm"
  import {
   ProductCategory as MedusaProductCategory,
  } from "@medusajs/medusa"
  import { Store } from "@medusajs/medusa"
  
  @Entity()
  @Tree("materialized-path")
  export class ProductCategory extends MedusaProductCategory {
    @Index("ProductCategoryStoreId")
    @Column({default:""})
    store_id: string
  
    @JoinColumn({ name: "store_id", referencedColumnName: "id" })
    store?: Store

    @TreeParent()
    @JoinColumn({ name: "parent_category_id" })
    parent_category: Relation<ProductCategory> | null

    @Column()
    parent_category_id: string | null
  
    @TreeChildren({ cascade: true })
    category_children: Relation<ProductCategory>[]
  }