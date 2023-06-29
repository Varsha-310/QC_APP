import { Router } from "express";
import {
  install,
  installCallback
} from "../controllers/shopifyController";
const shopifyRoute = Router();

// Route of app installation
shopifyRoute.get("/install", install);

// Route of app installation callback
shopifyRoute.get("/callback", installCallback);

export default shopifyRoute;
