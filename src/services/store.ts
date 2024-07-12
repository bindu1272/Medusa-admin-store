import { EntityManager } from "typeorm";
import { FindConfig, Store, buildQuery } from "@medusajs/medusa";
import { CurrencyRepository } from "../repositories/currency";
import { StoreRepository } from "../repositories/store";
import { StoreService as MedusaStoreService } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import { User } from "../models/user";
import { Lifetime } from "awilix";

type InjectedDependencies = {
  manager: EntityManager;
  storeRepository: typeof StoreRepository;
  currencyRepository: typeof CurrencyRepository;
};
class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly currencyRepository_: typeof CurrencyRepository;
  protected readonly container: any;
  protected readonly loggedInUser_: User | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {}
  }

  async create(): Promise<Store> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const storeRepository = transactionManager.withRepository(
          this.storeRepository_
        );
        const currencyRepository = transactionManager.withRepository(
          this.currencyRepository_
        );

        let store = await this.retrieve().catch(() => void 0);
        if (store) {
          return store;
        }

        const newStore = storeRepository.create();
        const usd = await currencyRepository.findOne({
          where: {
            code: "usd",
          },
        });

        if (usd) {
          newStore.currencies = [usd];
        }

        store = await storeRepository.save(newStore);
        return store;
      }
    );
  }

  async createStore(data: {
    Store_Name: string;
    Currency_Code: string;
  }): Promise<Store> {
    console.log("serv**", data);
    return this.atomicPhase_(async (manager) => {
      const stores = manager.withRepository(this.storeRepository_);
      const post = stores.create();
      post.name = data.Store_Name;
      post.default_currency_code = data.Currency_Code;
      const result = await stores.save(post);
      return result;
    });
  }

  async retrieveForLoggedInUser(config?: FindConfig<Store>) {
    const storeRepo = this.manager_.withRepository(this.storeRepository_);
    const store = await storeRepo.findOne({
      ...config,
      relations: [...config.relations, "members"],
      where: {
        id: this.loggedInUser_.store_id,
      },
    });

    if (!store) {
      throw new Error("Unable to find the user store");
    }

    return store;
  }

  async retrieve(config: FindConfig<Store> = {}): Promise<Store> {
    const manager = this.manager_;
    const storeRepo = manager.withRepository(this.storeRepository_);
    const query = buildQuery({ id: this.loggedInUser_?.store_id }, config);
    const store = await storeRepo.findOne(query);

    if (!store) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Store does not exist"
      );
    }

    return store;
  }
}

export default StoreService;
