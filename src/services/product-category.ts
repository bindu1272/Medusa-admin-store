import { EntityManager } from "typeorm";
import { FindConfig, buildQuery, ProductCategory } from "@medusajs/medusa";
import { ProductCategoryRepository } from "../repositories/product-category";
import { ProductCategoryService as MedusaProductCategoryService } from "@medusajs/medusa";
import { User } from "../models/user";

import { Lifetime } from "awilix";
import { CreateProductCategoryInput } from "../types/product-category";
import { Selector } from "../types/common";
import { Router } from "express";
import { isDefined, MedusaError } from "medusa-core-utils";

const route = Router();

class ProductCategoryService extends MedusaProductCategoryService {
  protected readonly loggedInUser_: User | null;
  static LIFE_TIME = Lifetime.SCOPED;
  protected productCategoryRepository_: typeof ProductCategoryRepository;

  constructor(container:any, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    this.loggedInUser_ = null;
    try{
    this.loggedInUser_ = container?.loggedInUser ? container?.loggedInUser : null;
    }catch(err){

    }
    this.productCategoryRepository_ = container.productCategoryRepository;
  }


  applyMiddleware(route) {
    // route.use(middlewares.authenticate());
  }

  // async listAndCount(
  //   selector?: Selector<ProductCategory>,
  //   config: FindConfig<ProductCategory> = {
  //     skip: 0,
  //     take: 10,
  //     relations: [],
  //   }
  // ): Promise<any> {
  //   this.applyMiddleware(route);
  //   if (this.loggedInUser_?.store_id) {
  //     selector["store_id"] = this.loggedInUser_.store_id;
  //   }
  //   const postRepo = this.activeManager_.withRepository(
  //     this.productCategoryRepository_
  //   );
  //   delete selector?.["include_descendants_tree"];
  //   config = { ...config, ["relations"]: ["products.variants","products.variants.prices","products.sales_channels","products.options","products.collection"] };
  //   const query = buildQuery(selector, config);
  //   return  await postRepo.findAndCount(query);
  // }

  // async getAllProductCategories(
  //   body:any
  //   // selector?:any,
  //   // config: FindConfig<ProductCategory> = {
  //   //   skip: 0,
  //   //   take: 10,
  //   //   relations: [],
  //   // }
  //   ){
  //     console.log("body123",body);
  //   // this.applyMiddleware(route);
  //   // const postRepo = this.activeManager_.withRepository(this.productCategoryRepository_);
  //   // delete selector?.["include_descendants_tree"];
  //   // const query = buildQuery(selector, config);
  //   // return postRepo.findAndCount(query);
  //   return [];

  // }

  async retrievelistAndCount(
    selector?: Selector<ProductCategory>,
    config: FindConfig<ProductCategory> = {
      skip: 0,
      take: 10,
      relations: [],
    }
  ): Promise<[ProductCategory[], number]> {
    console.log("retrievelistAndCountmethod12")
    this.applyMiddleware(route);
    if (this.loggedInUser_?.store_id) {
      selector["store_id"] = this.loggedInUser_.store_id;
    }
    const postRepo = this.activeManager_.withRepository(
      this.productCategoryRepository_
    );
    delete selector?.["include_descendants_tree"];
    config = { ...config, ["relations"]: ["products.variants","products.variants.prices","products.sales_channels","products.options","products.collection"] };
    const query = buildQuery(selector, config);
    return postRepo.findAndCount(query);
  }

  // async create(
  //   productCategoryInput: CreateProductCategoryInput
  // ): Promise<ProductCategory> {
  //   return await this.atomicPhase_(async (manager) => {
  //     const pcRepo = manager.withRepository(this.productCategoryRepository_);
  //     let data = {
  //       ...productCategoryInput,
  //       store_id: this.loggedInUser_?.store_id,
  //     };
  //     let productCategory = pcRepo.create(data);
  //     productCategory = await pcRepo.save(productCategory);
  //     console.log("productCategory", productCategory);
  //     // await this.eventBusService_.withTransaction(manager).emit(ProductCategoryService.Events.CREATED, {
  //     //     id: productCategory?.id,
  //     //   })
  //     return productCategory;
  //   });
  // }

  // async retrieve(
  //   productCategoryId: string,
  //   config: FindConfig<ProductCategory> = {},
  //   selector: Selector<ProductCategory> = {}
  // ): Promise<ProductCategory> {
  //   if (!isDefined(productCategoryId)) {
  //     throw new MedusaError(
  //       MedusaError.Types.NOT_FOUND,
  //       `"productCategoryId" must be defined`
  //     );
  //   }

  //   const selectors = Object.assign({ id: productCategoryId }, selector);
  //   const query = buildQuery(selectors, config);
  //   const productCategoryRepo = this.manager_.withRepository(
  //     this.productCategoryRepository_
  //   );

  //   const productCategory = await productCategoryRepo.findOne(query);

  //   if (!productCategory) {
  //     throw new MedusaError(
  //       MedusaError.Types.NOT_FOUND,
  //       `ProductCategory with id: ${productCategoryId} was not found`
  //     );
  //   }

  //   const productCategoryTree = await productCategoryRepo.findDescendantsTree(
  //     productCategory
  //   );

  //   return productCategoryTree;
  // }

}

export default ProductCategoryService;
