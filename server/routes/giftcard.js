import { Router } from "express";
import { createGiftcardProducts } from "../controllers/giftcard";
import { verifyJwt } from "../helper/jwtHelper";

const giftcardRoute = Router();

// route to initiate kyc
giftcardRoute.post("/products/add", verifyJwt, createGiftcardProducts);

export default giftcardRoute;