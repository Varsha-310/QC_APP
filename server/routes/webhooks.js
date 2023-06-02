import { Router } from "express";
import { verifyShopifyHook } from "../helper/validator";
const {
  ordercreated,
  orderupdated,
  orderdeleted,
} = require("../controllers/webhookController");
const { appUninstalled } = require("../controllers/shopifyController");

const webhookRoute = Router();

// api for order create webhook
webhookRoute.post("/ordercreated", verifyShopifyHook, ordercreated);

// api for order update webhook
webhookRoute.post("/orderupdated", verifyShopifyHook, orderupdated);

// api for order delete webhook
webhookRoute.post("/orderdeleted", verifyShopifyHook, orderdeleted);

// api for app uninstall webhook
webhookRoute.post("/appuninstalled", verifyShopifyHook, appUninstalled);

module.exports = webhookRoute;
