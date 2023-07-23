import { Router } from "express";
import {verifyJwt } from "../helper/jwtHelper"
import { handleBillingDetails, handleBillingList } from "../controllers/BillingController";
import { seedBillingHistory } from "../helper/seedBillingHostory";

const billingRoute = Router();

// Route to fetch the store data
billingRoute.get("/list",verifyJwt, handleBillingList);

billingRoute.get("/seed", seedBillingHistory);

//order Sync url
//billing/currnt/uses
billingRoute.get("/current/uses",verifyJwt, handleBillingDetails);

export default billingRoute;
