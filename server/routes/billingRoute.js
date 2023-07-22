import { Router } from "express";
import {verifyJwt } from "../helper/jwtHelper.js"
import { handleBillingDetails, handleBillingList } from "../controllers/BillingController.js";

const billingRoute = Router();

// Route to fetch the store data
billingRoute.get("/list",verifyJwt, handleBillingList);

//order Sync url
//billing/currnt/uses
billingRoute.get("/current/uses",verifyJwt, handleBillingDetails);

export default billingRoute;
