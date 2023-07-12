import { Router } from "express";
import { handleOrderDataList, handleOrderDetails, handleSyncOrder} from "../controllers/OrderController";
import {verifyJwt , createJwt} from "../helper/jwtHelper"

const orderRoute = Router();

// Route to fetch the store data
orderRoute.get("/list",verifyJwt, handleOrderDataList);

// order Sync url
orderRoute.get("/sync",verifyJwt, handleSyncOrder);

// Get Order Deetails
orderRoute.get("/details", verifyJwt, handleOrderDetails)

export default orderRoute;
