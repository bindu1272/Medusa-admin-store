import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import StoreService from "../../../../services/store";

interface CreateStoreDTO {
  Store_Name: string;
  Currency_Code: string;
}

export const POST = async(
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  const body = req.body as CreateStoreDTO;
    console.log("reqbody", req.body);
    const storeService: StoreService = req.scope.resolve("storeService");
    return res.json(await storeService.createStore(body))
}
  
  export const AUTHENTICATE = false