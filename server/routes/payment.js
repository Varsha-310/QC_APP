import { Router } from "express";
import {
    create,payuPayment
} from "../controllers/paymentController.js";
import {verifyPayuTranscation} from "../middleware/payU.js"

const paymentRoute = Router();

// Route of creating payment
paymentRoute.get("/create", create);
paymentRoute.post("/payu/success", payuPayment);
paymentRoute.post("/payu/fail", payuPayment);
paymentRoute.post("/payu/verify", verifyPayuTranscation);

export default paymentRoute;