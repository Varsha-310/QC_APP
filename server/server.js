import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import gdprRoute from "./routes/gdpr";
import planRoute from "./routes/plan";
import shopifyRoute from "./routes/shopify";
import webhookRoute from "./routes/webhooks";
import refundSettingRoute from "./routes/refund";
import storesRoute from "./routes/store";
import calculateRefundAmount from "./routes/calculateRefund";
import checkamount from "./routes/giftcardamount";
import { respondSuccess, respondInternalServerError } from "./helper/response";
import cron from "node-cron";
import { logger } from "./helper/utility";
import { createJwt } from "./helper/jwtHelper";
import cors from "cors";
import kycRoute from "./routes/kyc";
import giftcardRoute from "./routes/giftcard";
import { cronToCheckWebhooks } from "./config/custom";

export const app = express();

app.use(cors())
// CORS configuration
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );
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

app.enable("trust proxy", true);

// Api rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // Limit each IP to 60requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.get("/geneerate-token", async (req, res) => {

  const shop = req.query.shop;
  const jwt = await createJwt(shop);
  res.json(jwt);
});

// route to check app status
app.get("/", (req, res) => {
  res.json(respondSuccess("App is live"));
});

// shopify routes
app.use("/shopify", shopifyRoute);

// GDPR routes
app.use("/gdpr", gdprRoute);

//webhooks routes
app.use("/webhooks", webhookRoute)

//refund setting route
app.use("/refund", refundSettingRoute)

//Store details route
app.use("/stores", storesRoute)

//Calculate refund roure
app.use("/calculateRefund", calculateRefundAmount)

//Checking giftcard amount
app.use("/giftcardamount", checkamount)

//kyc routes
app.use("/kyc", kycRoute);

// plan routes
app.use("/plan" , planRoute)

// giftcard routes
app.use("/giftcard" , giftcardRoute)

// cron to check webhooks for every store
cron.schedule("* * * * *", () => {
  // cronToCheckWebhooks();
  // console.log("checking webhooks!");
});

// Database and Port connection
mongoose
  .connect("mongodb://0.0.0.0:27017/" + process.env.DB)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("server is running at " + process.env.PORT);
  })
  .catch((error) => {
    console.log("Error occurred, server can't start", error);
    logger.info("Error occurred, server can't start", error);
  });

// Global error handler
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  res.json(
    respondInternalServerError("Something went wrong try after sometime")
  );
});
