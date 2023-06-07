import { Router } from "express";
import {
  install,
  installCallback,
  appUninstalled,
} from "../controllers/shopifyController";
const shopifyRoute = Router();

// Route of app installation
shopifyRoute.get("/install", install);

// Route of app installation callback
shopifyRoute.get("/callback", installCallback);

// Route for uninstallation
shopifyRoute.post("/uninstall", appUninstalled);

export default shopifyRoute;
