import { Router } from "express";
import { addGiftcard, giftCardAmount ,createGiftcardProducts, deleteGiftcardProducts, getSelectedGc , getGiftcardProducts , updateGiftcardProduct, resendEmail, giftCardOrders , walletTransaction} from "../controllers/giftcard.js";
import { verifyJwt } from "../helper/jwtHelper.js";
import {  validateGetBalance , verifySendEmail ,validateAddToWallet,validateUpdateGiftcard , validatecreateGiftcard } from "../helper/validator.js";
import { getWalletBalance } from "../controllers/giftcard.js";

const giftcardRoute = Router();

// route to add a giftcard product
giftcardRoute.post("/products/add", verifyJwt, validatecreateGiftcard , createGiftcardProducts);

// route to edit giftcard product
giftcardRoute.put("/products/update", verifyJwt,validateUpdateGiftcard , updateGiftcardProduct);

// route to delet giftcard product
giftcardRoute.post("/products/delete", verifyJwt, validateUpdateGiftcard , deleteGiftcardProducts);

// route to retrive gc products for a store
giftcardRoute.post("/products/list", verifyJwt,  getGiftcardProducts);

// route to retrive single gc product
giftcardRoute.post("/products/select", verifyJwt, validateUpdateGiftcard , getSelectedGc);

// route to add giftcard to wallet
giftcardRoute.post("/wallet/addgiftcard" , validateAddToWallet , addGiftcard);

// route to get wallet balance
giftcardRoute.post("/wallet/balance" , validateGetBalance , getWalletBalance );

// route to resend email
giftcardRoute.post("/email" , verifyJwt , verifySendEmail ,resendEmail );

// route to fetch orders sent as giftcard
giftcardRoute.post("/orders" ,  verifyJwt, giftCardOrders );

// cards history within a wallet
giftcardRoute.post("/wallet/transaction"  , walletTransaction );

// to reedem qc giftcard
giftcardRoute.post("/redeem" ,   giftCardAmount);

export default giftcardRoute;