import { Router } from "express";
import { handleOrderDataList, handleOrderDetails, handleSyncOrder} from "../controllers/OrderController.js";
import {verifyJwt , createJwt} from "../helper/jwtHelper.js"

const orderRoute = Router();

// Route to fetch the store data
orderRoute.get("/list",verifyJwt, handleOrderDataList);

// order Sync url
orderRoute.get("/sync",verifyJwt, handleSyncOrder);

// Get Order Deetails
orderRoute.get("/details", verifyJwt, handleOrderDetails)

export default orderRoute;
