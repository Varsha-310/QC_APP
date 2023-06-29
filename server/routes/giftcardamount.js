import { Router } from "express";
import {checkGiftCardAmount} from "../controllers/giftcardamountController";
// import {validateCalculateRefundApi} from "../helper/validator"
// import {verifyJwt} from "../helper/jwtHelper"

const checkGiftCardAmountRoute = Router();

// Route to fetch the refund settings
checkGiftCardAmountRoute.post("/checkGiftCardAmount", checkGiftCardAmount);

export default checkGiftCardAmountRoute;
