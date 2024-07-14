import {
  FindConfig,
  Product,
  SalesChannel,
  buildQuery,
} from "@medusajs/medusa";
import { ProductRepository } from "../repositories/product";
import { ProductService as MedusaProductService } from "@medusajs/medusa";
import { User } from "../models/user";
import { ProductCategory } from "../models/product-category";
import { Lifetime } from "awilix";
import { Selector, QuerySelector } from "../types/common";
import { Router } from "express";
import ProductCategoryService from "./product-category";
// import SalesChannelService from "@medusajs/medusa";
import { ExtendedFindConfig } from "../types/common";

const route = Router();

class ProductService extends MedusaProductService {
  protected readonly loggedInUser_: User | null;

  static LIFE_TIME = Lifetime.SCOPED;
  protected productRepository_: typeof ProductRepository;
  protected productCategoryService_: ProductCategoryService;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    try {
      this.loggedInUser_ = container.loggedInUser;
      this.productCategoryService_ = container.productCategoryService;
      this.productRepository_ = container.productRepository_;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  applyMiddleware(route) {
    // route.use(middlewares.authenticate());
  }








  async listAndCount(
    selector: Selector<Product> = {},
    config: FindConfig<Product> = {
      skip: 0,
      take: 15,
      relations: [],
    }
  ): Promise<[Product[], number]> {
    this.applyMiddleware(route);

    const activeManager = this.activeManager_;
    if (!activeManager) {
      throw new Error("Active manager is not initialized.");
    }

    console.log("kil12",this.productCategoryService_);
    let products= [];
    let count = 0;

  //   if(this.productCategoryService_){
  //   const [categories, categoryCount] = await this.productCategoryService_.retrievelistAndCount({}, {
  //     skip: 0,
  //     take: 0,
  //     relations: []
  //   });

  //   const categoryIds = categories.map((category) => category.id);
  //   console.log("Category IDs:", categoryIds);

    

  //   if (!categoryIds || categoryIds.length === 0) {
  //     return [[], 0];
  //   }

  //   categories.forEach((category) => {
  //     if (category.products && category.products.length > 0) {
  //       category.products.forEach((product) => {
  //         products.push(product);
  //       });
  //     } else {
  //       console.log("No products in this category.");
  //     }
  //   });
  // }else{
  const sales_channel_id = "sc_01J2N34Z2AJN2FCRT8QWMG4YTG";
  const default_admin="n151272@rguktn.ac.in";
    // const productRepo = this.activeManager_.withRepository(this.productRepository_)
// config = {...config,sales_channel_id:sales_channel_id}
    // const { q, query, relations } = this.prepareListQuery_(selector, config)

    // if (q) {
    //   return await productRepo.getFreeTextSearchResultsAndCount(
    //     q,
    //     query,
    //     relations
    //   )
    // }

    // products = await productRepo.findWithRelationsAndCount(relations, query)\
    console.log("loggedinUser",this.loggedInUser_);
    if(this.loggedInUser_ && this.loggedInUser_?.email === default_admin)
    {
       const productRepo = this.activeManager_.withRepository(this.productRepository_)
    const { q, query, relations } = this.prepareListQuery_(selector, config)

    if (q) {
      return await productRepo.getFreeTextSearchResultsAndCount(
        q,
        query,
        relations
      )
    }

    const productsFromQuery = await productRepo.findWithRelationsAndCount(relations, query);
    console.log("products123",products);
    for(let i=0;i<productsFromQuery?.[0]?.length;i++){
        products.push(productsFromQuery[0]?.[i]);
      }
    count = products?.[0]?.length;
    return [products, count];

    }else{
      console.log("elsecase");
    const config1: FindConfig<SalesChannel> = {
              "relations": ['products',"products.variants",]
            };
           const channel =  await this.salesChannelService_.retrieve(sales_channel_id,config1);
           console.log("retrivechannel12",channel,[channel?.products,channel?.products?.length]);
           return [channel?.products,channel?.products?.length];
          }
  // }
  // console.log("productsList", products);

    // Calculate the count of products
    
  }


















//   async listAndCount(
//     selector: any,
//     config: FindConfig<Product> = {
//       skip: 0,
//       take: 15,
//       relations: [],
//     }
//   ): Promise<[Product[], number]> {
//     // console.log("params12",selector?.sales_channel_id?.[0]);
//     // if(selector?.sales_channel_id?.[0]){
//     //   const config1: FindConfig<SalesChannel> = {
//     //     "relations": ['products',"products.variants"]
//     //   };
//     //  const channel =  await this.salesChannelService_.retrieve(selector?.sales_channel_id?.[0],config1);
//     //  console.log("retrivechannel12",channel,[channel?.products,channel?.products?.length]);
//     //  return [channel?.products,channel?.products?.length];
//     // }
//     this.applyMiddleware(route);
//     // delete selector?.sales_channel_id;
//     console.log("caledlistandcount89",selector);
//     const activeManager = this.activeManager_;
//     if (!activeManager) {
//       throw new Error("Active manager is not initialized.");
//     }
//     let products = [];
//     let count = 0;

//     console.log("else123");
//     const productRepo = this.activeManager_.withRepository(this.productRepository_)
//     const { q, query, relations } = this.prepareListQuery_(selector, config)
//     if (q) {
//       return await productRepo.getFreeTextSearchResultsAndCount(
//         q,
//         query,
//         relations
//       )
//     }
//     const productsFromQuery = await productRepo.findWithRelationsAndCount(relations, query)
//     for(let i=0;i<productsFromQuery?.[0]?.length;i++){
//       products.push(productsFromQuery[0]?.[i]);
//     }
// console.log("products123",products);
//        count = products?.[0]?.length;
//     return [products, count];
//   }

 
  // async getAllProductCategories(
  //   selector?: any,
  //   config: FindConfig<ProductCategory> = {
  //     skip: 0,
  //     take: 10,
  //     relations: [],
  //   }
  // ) {
  //   this.applyMiddleware(route);
  //   const postRepo = this.activeManager_.withRepository(
  //     this.productCategoryRepository_
  //   );
  //   delete selector?.["include_descendants_tree"];
  //   config = { ...config, ["relations"]: ["products.variants","products.sales_channels","products.variants.prices","products.categories","products.options","products.collection"]};
  //   const query = buildQuery(selector, config);
  //   const productCategoryData:any = await postRepo.findAndCount(query);
  //   const products =[];
  //   productCategoryData?.[0]?.forEach((category:any) => {
  //     if (category.products && category.products.length > 0) {
  //       category.products.forEach((product:any) => {
  //         products.push(product);
  //       });
  //     } else {
  //       console.log("No products in this category.");
  //     }
  //   });
  //   console.log("products12",products);
  //   let count = products?.length;
  //   return {products,count};
  // }
}

export default ProductService;
