import { Router } from "express";
import {
  install,
  installCallback,
  logoutSession
} from "../controllers/shopifyController.js";
import { verifyJwt } from "../helper/jwtHelper.js";

const shopifyRoute = Router();

// Route of app installation
shopifyRoute.get("/install", install);

// Route of app installation callback
shopifyRoute.get("/callback", installCallback);

// Route to logout/expiry token
shopifyRoute.post("/logout", verifyJwt, logoutSession);


export default shopifyRoute;
