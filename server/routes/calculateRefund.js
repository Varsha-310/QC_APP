import { Router } from "express";
import {createRefundAmount} from "../controllers/calculateRefundController";
import {validateCalculateRefundApi} from "../helper/validator"
import {verifyJwt} from "../helper/jwtHelper"

const calculateRefundRoute = Router();

// Route to fetch the refund settings
calculateRefundRoute.post("/createRefundAmount",verifyJwt, validateCalculateRefundApi, createRefundAmount);

export default calculateRefundRoute;
