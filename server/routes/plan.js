import { Router } from "express";
import { verifyJwt } from "../helper/jwtHelper";
import { planListing } from "../controllers/planController";

const planRoute = Router();

// route to initiate kyc
planRoute.post("/list", verifyJwt, planListing);

export default planRoute;
