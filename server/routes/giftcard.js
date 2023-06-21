import { Router } from "express";
import { createGiftcardProducts, getGiftcardProducts, storeTemplate, updateGiftcardProduct } from "../controllers/giftcard";
import { verifyJwt } from "../helper/jwtHelper";
import { verifyGetGiftcard , validateGetBalance } from "../helper/validator";
import { getWalletBalance } from "../controllers/giftcard";

const giftcardRoute = Router();

// route to add a giftcard product
giftcardRoute.post("/products/add", verifyJwt, createGiftcardProducts);

// route to edit giftcard product
giftcardRoute.post("/products/update", verifyJwt, updateGiftcardProduct);

// route to retrive gc product for a store
giftcardRoute.post("/products/list", verifyJwt, verifyGetGiftcard , getGiftcardProducts);

//route to add giftcard template
giftcardRoute.post("/template/add", verifyJwt , storeTemplate);

giftcardRoute.post("/wallet/balance" , validateGetBalance , getWalletBalance );

export default giftcardRoute;