import { Currency } from "@medusajs/medusa"
import {
    dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
    CurrencyRepository as MedusaCurrencyRepository,
} from "@medusajs/medusa/dist/repositories/currency"

export const CurrencyRepository = 
dataSource.getRepository(Currency)
	.extend(Object.assign(MedusaCurrencyRepository, { target: Currency }));
export default CurrencyRepository