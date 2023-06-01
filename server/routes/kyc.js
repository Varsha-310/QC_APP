import { Router } from "express";
import { initiatieKyc } from "../controllers/kycController";
import { verifyJwt } from "../helper/jwtHelper";

const kycRoute = Router();

// route to initiate kyc
kycRoute.post("/initiate", verifyJwt, initiatieKyc);

export default kycRoute;
