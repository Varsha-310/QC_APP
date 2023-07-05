import { Router } from "express";
import {  initiatieKyc , statusKyc } from "../controllers/kycController";
import { verifyJwt } from "../helper/jwtHelper";

const kycRoute = Router();

// route to initiate kyc
kycRoute.post("/initiate", verifyJwt, initiatieKyc);

// route to initiate kyc
kycRoute.post("/status", verifyJwt, statusKyc);

export default kycRoute;
