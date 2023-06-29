import { Router } from "express";
import { addGiftcardtoWallet, addGiftcardtoWallets, createGiftcardProducts, deleteGiftcardProducts, getGiftcardProducts , updateGiftcardProduct } from "../controllers/giftcard";
import { verifyJwt } from "../helper/jwtHelper";
import {  validateGetBalance , validateAddToWallet,validateUpdateGiftcard , validatecreateGiftcard } from "../helper/validator";
import { getWalletBalance } from "../controllers/giftcard";

const giftcardRoute = Router();

// route to add a giftcard product
giftcardRoute.post("/products/add", verifyJwt, validatecreateGiftcard , createGiftcardProducts);

// route to edit giftcard product
giftcardRoute.put("/products/update", verifyJwt,validateUpdateGiftcard , updateGiftcardProduct);

// route to delet giftcard product
giftcardRoute.post("/products/delete", verifyJwt, validateUpdateGiftcard , deleteGiftcardProducts);

// route to retrive gc product for a store
giftcardRoute.post("/products/list", verifyJwt,  getGiftcardProducts);

// route to add giftcard to wallet
giftcardRoute.post("/wallet/addgiftcard" , validateAddToWallet , addGiftcardtoWallets);

// route to get wallet balance
giftcardRoute.get("/wallet/balance" , validateGetBalance , getWalletBalance );



export default giftcardRoute;