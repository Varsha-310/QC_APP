import { Router } from "express";
import { verifyJwt } from "../helper/jwtHelper.js";
import { planListing } from "../controllers/planController.js";

const planRoute = Router();

// route to initiate kyc
planRoute.post("/list", verifyJwt, planListing);

export default planRoute;
