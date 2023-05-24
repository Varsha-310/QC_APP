require('dotenv').config();
const bodyParser = require('body-parser');
const express = require("express");
const rateLimit = require('express-rate-limit');
const shopifyRoute = require("./routes/shopify");
const gdprRoute = require("./controllers/gdprController");
const mongoose = require('mongoose');
const {verifyShopifyHook} = require("./helper/validator");

const app = express();

// CORS configuration
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json({
    limit:'50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
  }));

app.use(bodyParser.json());

app.enable('trust proxy', true);

// Api rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use("/shopify", shopifyRoute);

// GDPR Routes
app.use("/gdpr", verifyShopifyHook, gdprRoute);

app.use('/', shopifyRoute);

// Database and Port connection
mongoose.connect("mongodb://0.0.0.0:27017/" + process.env.DB)
    .then(() => {
        app.listen(process.env.PORT);
        console.log("server is running at " + process.env.PORT);
    })
    .catch((error) => {
        console.log("Error occurred, server can't start", error);
    });

// Global error handler  
app.use((err, req, res, next) => {
    if (!err) {
        return next();
    }
    res.status(500);
    res.send(err);
});

