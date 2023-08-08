import { Router } from "express";
import { transactionData , mandateData} from "../controllers/paymentController.js";

const paymentRoute = Router();

// webhook for mandate data
paymentRoute.post("/webhook/mandate",  mandateData);

// webhook for transaction data
paymentRoute.post("/webhook/transaction", transactionData);

export default paymentRoute;
