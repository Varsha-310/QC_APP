import { Router } from "express";
import { validateRefund, validateRefundCalculate, validateUpdateConfigApi} from "../helper/validator";
import { verifyJwt } from "../helper/jwtHelper";
import { 
    handleCalculateRefundAmount, 
    handleRefundAction, 
    getConfigapi, 
    updateConfigapi 
} from "../controllers/RefundController";

const refundRoute = Router();

// Route to fetch the refund settings
refundRoute.get("/getSetting",verifyJwt, getConfigapi);

//Route to update the refund
refundRoute.put("/updateSetting",verifyJwt, validateUpdateConfigApi, updateConfigapi);

// Route to fetch the refund settings
refundRoute.post("/initaite",verifyJwt, validateRefund, handleRefundAction);

// Route to fetch the refund settings
refundRoute.get("/calculate", verifyJwt, validateRefundCalculate, handleCalculateRefundAmount);

export default refundRoute;
