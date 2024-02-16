import { Router } from "express";
import { verifyShopifyHook } from "../helper/validator.js";
import { orderCreated, orderDeleted, orderUpdated, productCreateEvent, productDeleteEvent, productUpdateEvent,getQcCredentials } from "../controllers/webhookController.js";
import { appUninstalled } from "../controllers/shopifyController.js";

const webhookRoute = Router();

// api for order create webhook
webhookRoute.post("/ordercreated", orderCreated);

// api for order update webhook
webhookRoute.post("/orderupdated",verifyShopifyHook, orderUpdated);

// api for order delete webhook
webhookRoute.post("/orderdeleted",verifyShopifyHook, orderDeleted);

// api for app uninstall webhook
webhookRoute.post("/appuninstalled",verifyShopifyHook, appUninstalled);

//  api for product create webhook
webhookRoute.post("/productcreated" ,verifyShopifyHook,productCreateEvent);

// api for product update webhook
webhookRoute.post("/productupdated",verifyShopifyHook, productUpdateEvent);

// api for product delete webhook
webhookRoute.post("/productdeleted",verifyShopifyHook, productDeleteEvent);

// webhook from QC for merchant data
webhookRoute.post("/qc/credentials", getQcCredentials)

 export default webhookRoute;
