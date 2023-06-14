import { Router } from "express";
import {getConfigapi, updateConfigapi} from "../controllers/refundController";
import { validateUpdateConfigApi , validategetConfigApi} from "../helper/validator";


const refundRoute = Router();

// Route to fetch the refund settings
refundRoute.post("/getSetting",validategetConfigApi, getConfigapi);

//Route to update the refund
refundRoute.put("/updateSetting",validateUpdateConfigApi, updateConfigapi);

export default refundRoute;
