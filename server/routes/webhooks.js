import { Router } from "express";
import { verifyShopifyHook } from "../helper/validator.js";
import { orderCreated, orderDeleted, orderUpdated, productCreateEvent, productDeleteEvent, productUpdateEvent,getQcCredentials } from "../controllers/webhookController.js";
import { appUninstalled } from "../controllers/shopifyController.js";
import { qwikcilverToken } from "../middleware/qwikcilver.js";

const webhookRoute = Router();

// api for order create webhook
webhookRoute.post("/ordercreated", orderCreated);

// api for order update webhook
webhookRoute.post("/orderupdated", orderUpdated);

// api for order delete webhook
webhookRoute.post("/orderdeleted", orderDeleted);

// api for app uninstall webhook
webhookRoute.post("/appuninstalled", appUninstalled);

//  api for product create webhook
webhookRoute.post("/productcreated" ,productCreateEvent);

// api for product update webhook
webhookRoute.post("/productupdated", productUpdateEvent);

// api for product delete webhook
webhookRoute.post("/productdeleted", productDeleteEvent);

// webhook from QC for merchant data
webhookRoute.post("/qc/credentials", getQcCredentials)

 export default webhookRoute;
