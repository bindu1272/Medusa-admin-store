import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import UserService from "../../../../services/user";
import { UserRoles } from "src/models/user";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  console.log("reqbody", req.body);
  const body = req.body ;
  const userService: UserService = req.scope.resolve("userService");
  return res.json(await userService.createNewUserByStore(body));
};

export const AUTHENTICATE = false;
