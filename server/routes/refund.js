import { Router } from "express";
import {getConfigapi, updateConfigapi} from "../controllers/refundController";
import { validateUpdateConfigApi} from "../helper/validator";
import { verifyJwt } from "../helper/jwtHelper";


const refundRoute = Router();

// Route to fetch the refund settings
refundRoute.get("/getSetting",verifyJwt, getConfigapi);

//Route to update the refund
refundRoute.put("/updateSetting",verifyJwt, validateUpdateConfigApi, updateConfigapi);

export default refundRoute;
