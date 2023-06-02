import { Router } from "express";
import {
  getUserDetails,
  deleteStoreData,
  deleteUserData,
} from "../controllers/gdprController";
import { verifyShopifyHook } from "../helper/validator";

const gdprRoute = Router();

// gdpr api to get customer data;
gdprRoute.post("/customer/data", verifyShopifyHook, getUserDetails);

// gdpr api to delete customer data
gdprRoute.post("/customer/delete", verifyShopifyHook, deleteUserData);

// gdpr api to delete store data
gdprRoute.post("/store/delete", verifyShopifyHook, deleteStoreData);

export default gdprRoute;
