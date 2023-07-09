import { Router } from "express";
import {  initiatieKyc , statusKyc } from "../controllers/kycController.js";
import { verifyJwt } from "../helper/jwtHelper.js";

const kycRoute = Router();

// route to initiate kyc
kycRoute.post("/initiate", verifyJwt, initiatieKyc);

// route to initiate kyc
kycRoute.post("/status", verifyJwt, statusKyc);

export default kycRoute;
