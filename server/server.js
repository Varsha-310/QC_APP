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
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
import refundRoute from "./routes/refund.js";
import orderRoute from "./routes/orderRoute.js";

export const app = express();

// CORS configuration
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

app.enable("trust proxy", true);


// Api rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
console.log("Path Before",__dirname);
__dirname = __dirname.substring(0,__dirname.length - 7);
console.log("Path after", __dirname);
const publicPath = path.join('./client/build');
app.use(express.static(publicPath));
app.use(express.static(path.join(__dirname, "js")));

//a shopify routes
app.use("/shopify", shopifyRoute);

// GDPR routes
app.use("/gdpr", gdprRoute);

//webhooks routes
app.use("/webhooks", webhookRoute)

//refund setting route
app.use("/refund", refundRoute)

//Store details route
app.use("/order", orderRoute)

//Checking giftcard amount
//app.use("/giftcardamount", checkamount)

//kyc routes
app.use("/kyc", kycRoute);

// plan routes
app.use("/plan" , planRoute)

// giftcard routes
app.use("/giftcard" , giftcardRoute)


app.get('/', function (req, res) {
  
  console.log( "Requested Url", req.url);
  res.sendFile(path.join(__dirname, './client/build', 'index.html'));
});
// cron to check webhooks for every store
cron.schedule("* * * * *", () => {
  // cronToCheckWebhooks();
  // console.log("checking webhooks!");
});

// Database and Port connection
mongoose
  // .connect(process.env.DB_URL + process.env.DB)
  .connect("mongodb://0.0.0.0:27017/" + process.env.DB)
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