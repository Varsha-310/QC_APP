import { Router } from "express";
import { verifyJwt } from "../helper/jwtHelper";
import { planListing, planSelect } from "../controllers/planController";

const planRoute = Router();

// route to initiate kyc
planRoute.post("/list", verifyJwt, planListing);

planRoute.post("/SELECT", verifyJwt, planSelect);


export default planRoute;
