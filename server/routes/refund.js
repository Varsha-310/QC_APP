import { Router } from "express";
import { validateRefund, validateRefundCalculate, validateUpdateConfigApi} from "../helper/validator.js";
import { verifyJwt } from "../helper/jwtHelper.js";
import { 
    handleCalculateRefundAmount, 
    handleRefundAction, 
    getConfigapi, 
    updateConfigapi 
} from "../controllers/RefundController.js";

const refundRoute = Router();

// Route to fetch the refund settings
refundRoute.get("/getSetting",verifyJwt, getConfigapi);

//Route to update the refund
refundRoute.put("/updateSetting",verifyJwt, validateUpdateConfigApi, updateConfigapi);

// Route to fetch the refund settings
refundRoute.post("/initiate",verifyJwt, validateRefund, handleRefundAction);

// Route to fetch the refund settings
refundRoute.post("/calculate", verifyJwt, validateRefundCalculate, handleCalculateRefundAmount);

export default refundRoute;
