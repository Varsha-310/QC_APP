import { Router } from "express";
import { createGiftcardProducts, getGiftcardProducts, storeTemplate, updateGiftcardProduct } from "../controllers/giftcard";
import { verifyJwt } from "../helper/jwtHelper";

const giftcardRoute = Router();

// route to add a giftcard product
giftcardRoute.post("/products/add", verifyJwt, createGiftcardProducts);

// route to edit giftcard product
giftcardRoute.post("/products/update", verifyJwt, updateGiftcardProduct);

// route to retrive gc product for a store
giftcardRoute.post("/products/list", verifyJwt, getGiftcardProducts);

//route to add giftcard template
giftcardRoute.post("/template/add", verifyJwt , storeTemplate);


export default giftcardRoute;