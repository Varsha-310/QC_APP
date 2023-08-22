import { Router } from "express";
import {checkGiftCardAmount} from "../controllers/giftcardamountController";

const checkGiftCardAmountRoute = Router();

// Route to fetch the refund settings
checkGiftCardAmountRoute.post("/checkGiftCardAmount", checkGiftCardAmount);

export default checkGiftCardAmountRoute;
