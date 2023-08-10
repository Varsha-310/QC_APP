import { Router } from "express";
import {
    create,payuPayment
} from "../controllers/paymentController.js";
import {verifyPayuTranscation} from "../middleware/payU.js"

const paymentRoute = Router();

// Route of creating payment
paymentRoute.post("/create", create);

// route of success url for mandate transaction
paymentRoute.post("/payu/success", payuPayment);

// route of fail url for mandate transaction
paymentRoute.post("/payu/fail", payuPayment);

// route to verify payment
paymentRoute.post("/payu/verify", verifyPayuTranscation);



export default paymentRoute;
