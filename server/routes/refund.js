import { Router } from "express";
import { validateRefund, validateRefundCalculate, validateRefundStoreCredit, validateUpdateConfigApi} from "../helper/validator.js";
import { verifyJwt, verifyRefundAPI } from "../helper/jwtHelper.js";
import { 
    handleCalculateRefundAmount, 
    handleRefundAction, 
    getConfigapi, 
    updateConfigapi 
} from "../controllers/RefundController.js";
import { handleStoreCredit } from "../controllers/ExtRefundController.js";

const refundRoute = Router();

// Route to fetch the refund settings
refundRoute.get("/getSetting",verifyJwt, getConfigapi);

//Route to update the refund
refundRoute.put("/updateSetting",verifyJwt, validateUpdateConfigApi, updateConfigapi);

// Route to fetch the refund settings
refundRoute.post("/initiate",verifyJwt, validateRefund, handleRefundAction);

// Route to fetch the refund settings
refundRoute.post("/calculate", verifyJwt, validateRefundCalculate, handleCalculateRefundAmount);

// Route to accept refund from outside
refundRoute.post("/store-credit", verifyRefundAPI, validateRefundStoreCredit, handleStoreCredit);

export default refundRoute;
