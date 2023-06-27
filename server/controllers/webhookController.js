import { respondSuccess, respondInternalServerError } from "../helper/response";
import { logger } from "../helper/utility";
import Queue from "better-queue";
import orders from "../models/orders"


/**
 * To handle order creation webhook
 * @param {*} req
 * @param {*} res
 */

export const orderCreated = (req, res) => {

  handleOrderCreatewebhook(req, res);
  res.json(respondSuccess("webhook received"));
};

/**
 * To handle order update webhook
 * @param {*} req
 * @param {*} res
 */

export const orderUpdated = (req, res) => {
  // console.log(req.body);
  handleOrderCreatewebhook(req, res)
  res.send(respondSuccess("webhook received"));
};

/**
 * To handle order delete webhook
 * @param {*} req
 * @param {*} res
 */

export const orderDeleted = (req, res) => {
  // res.json(respondSuccess("webhook received"));
};

/**
 * Handle order create event
 * @param {*} req
 * @param {*} res
 */

const ordercreateEvent = (input, done) => {
  try {
    const { shop, order } = input;
  }
  catch (err) {
    console.log(err);
    logger.info(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }

  done();
};

/**
 * Queue to handle webhooks
 */

const orderCreateQueue = new Queue(ordercreateEvent, {
  maxRetries: 2,
  retryDelay: 1000,
});


/** 
 * to handle order while creating and updating
 * @param {*} req 
 * @param {*} res 
 */

export const handleOrderCreatewebhook = async (req, res) => {
  try {

    const orderData = req.body;
    console.log(orderData.id);

    const store = req.headers["x-shopify-shop-domain"];
    orderData.store_url = store;

    await orders.updateOne({ store_url: store, id: orderData.id }, orderData, { upsert: true });
    console.log("Webhook Complieted");

  } catch (err) {
    logger.info(err);
    console.log(err);
  }
};

