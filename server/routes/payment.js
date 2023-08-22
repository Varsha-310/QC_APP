import { Router } from "express";
import {
    create,payuPayment , failurePayment
} from "../controllers/paymentController.js";
import {verifyPayuTranscation} from "../middleware/payU.js"
import { verifyJwt } from "../helper/jwtHelper.js";

const paymentRoute = Router();

// Route of creating payment
paymentRoute.post("/create", verifyJwt , create);

// route of success url for mandate transaction
paymentRoute.post("/payu/success", payuPayment);

// route of fail url for mandate transaction
paymentRoute.post("/payu/fail", failurePayment);

// route to verify payment
paymentRoute.post("/payu/verify", verifyPayuTranscation);

export default paymentRoute;
