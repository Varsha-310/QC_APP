import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import gdprRoute from "./routes/gdpr.js";
import planRoute from "./routes/plan.js";
import shopifyRoute from "./routes/shopify.js";
import { respondSuccess, respondInternalServerError } from "./helper/response.js";
import cron from "node-cron";
import { logger } from "./helper/utility.js";
import kycRoute from "./routes/kyc.js";
import webhookRoute from "./routes/webhooks.js";
import giftcardRoute from "./routes/giftcard.js";
import refundRoute from "./routes/refund.js";
import orderRoute from "./routes/orderRoute.js";
import billingRoute from "./routes/billingRoute.js";
import paymentRoute from "./routes/payment.js";


export const app = express();

//CORS Configuration
app.use(function (req, res, next) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH");
  res.setHeader("Access-Control-Allow-Headers","*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// defining rawbody from request
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.enable("trust proxy", true);

// Api rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//a shopify routes
app.use("/shopify", apiLimiter ,shopifyRoute);

// Billing API
app.use("/billing",apiLimiter, billingRoute);

// GDPR routes
app.use("/gdpr",apiLimiter, gdprRoute);

//webhooks routes
app.use("/webhooks",apiLimiter, webhookRoute)

//refund setting route
app.use("/refund",apiLimiter, refundRoute)

//Store details route
app.use("/order",apiLimiter, orderRoute)

//kyc routes
app.use("/kyc",apiLimiter, kycRoute);

// plan routes
app.use("/plan" ,apiLimiter, planRoute);

// giftcard routes
app.use("/giftcard" ,apiLimiter, giftcardRoute);

// payment routes
app.use("/payment",apiLimiter ,paymentRoute);

// cron to check webhooks for every store
cron.schedule("* * * * *", () => {
  // cronToCheckWebhooks();
  // console.log("checking webhooks!");
});

// Database and Port connection
mongoose
   .connect(process.env.DB_URL)
  .then(() => {

    app.listen(process.env.PORT);
    console.log("server is listening to " + process.env.PORT);
  })
  .catch((error) => {
    console.log("Error occurred, server can't start", error);
    logger.info("Error occurred, server can't start", error);
  });

// Global error handler
app.use((err, req, res, next) => {
  
  console.log("Error Encountered: ", err);
  return res.json(respondInternalServerError());
});
