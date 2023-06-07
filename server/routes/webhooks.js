import { Router } from "express";
import { verifyShopifyHook } from "../helper/validator";
import { orderCreated, orderDeleted, orderUpdated } from "../controllers/webhookController";
import { appUninstalled } from "../controllers/shopifyController";

const webhookRoute = Router();

// api for order create webhook
webhookRoute.post("/ordercreated", verifyShopifyHook, orderCreated);

// api for order update webhook
webhookRoute.post("/orderupdated", verifyShopifyHook, orderUpdated);

// api for order delete webhook
webhookRoute.post("/orderdeleted", verifyShopifyHook, orderDeleted);

// api for app uninstall webhook
webhookRoute.post("/appuninstalled", verifyShopifyHook, appUninstalled);

 export default webhookRoute;
