import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import gdprRoute from "./routes/gdpr";
import shopifyRoute from "./routes/shopify";
import { respondSuccess, respondInternalServerError } from "./helper/response";
import cron from "node-cron";
import { logger } from "./helper/utility";
import kycRoute from "./routes/kyc";
import webhookRoute from "./routes/webhooks";
import giftcardRoute from "./routes/giftcard";

export const app = express();

// CORS configuration
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
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

// route to check app status
app.get("/", (req, res) => {
  res.json(respondSuccess("App is live"));
});

// shopify routes
app.use("/shopify", shopifyRoute);

// GDPR routes
app.use("/gdpr", gdprRoute);

// webhook routes
app.use("/webhooks",webhookRoute);

//kyc routes
app.use("/kyc", kycRoute);

// giftcard routes
app.use("/giftcard" , giftcardRoute)

// cron to check webhooks for every store
cron.schedule("0 */6 * * *", () => {
  console.log("checking webhooks!");
});

// Database and Port connection
mongoose
  .connect("mongodb://0.0.0.0:27017/" + process.env.DB)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("server is running at " + process.env.PORT);
    logger.info("server is running at " + process.env.PORT);
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
