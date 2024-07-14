import express, { Router } from "express";
import  cors from "cors";
// import storeRoutes from "./store/custom/route";


// import { projectConfig } from "../../medusa-config";
import { errorHandler } from "@medusajs/medusa";
import { registerLoggedInUser } from "./middlewares/logged-in-user";
import authenticate from "@medusajs/medusa/dist/api/middlewares/authenticate";

// const storeOptions = {
//   origin: projectConfig.store_cors.split(","),
//   credentials: true,
// };

export default (rootDirectory, options) => {
  const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";
  const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";
  const router = Router();

  router.use(express.json());

  router.use(express.urlencoded({ extended: true }));
  console.log("adminOptions", options);
  const corsOptions = {
    origin: ADMIN_CORS.split(","),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  };
//   const storeOptions = {
//     origin: projectConfig.store_cors.split(","),
//     credentials: true,
//   };
//   storeRoutes(router, storeOptions)


  router.use(/\/admin\/[^(auth)].*/,cors(corsOptions), authenticate(), registerLoggedInUser);
  router.use(cors({
    origin: [STORE_CORS.split(","), ADMIN_CORS.split(",")].flat(),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }));
  router.use(errorHandler());
  return router;
};
