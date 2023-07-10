import { Router } from "express";
import {  initiatieKyc , statusKyc , kycDetails } from "../controllers/kycController.js";
import { verifyJwt } from "../helper/jwtHelper.js";

const kycRoute = Router();

// route to initiate kyc
kycRoute.post("/initiate", verifyJwt, initiatieKyc);

// route to initiate kyc
kycRoute.post("/status", verifyJwt, statusKyc);

// webhook to get details from Manch
kycRoute.post("/details", kycDetails);

export default kycRoute;
