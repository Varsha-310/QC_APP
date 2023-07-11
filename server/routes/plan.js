import { Router } from "express";
import { verifyJwt } from "../helper/jwtHelper.js";
import { planListing, planSelect } from "../controllers/planController.js";

const planRoute = Router();

// route to initiate kyc
planRoute.post("/list", verifyJwt, planListing);

planRoute.post("/select", verifyJwt, planSelect);


export default planRoute;
