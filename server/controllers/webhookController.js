import { respondSuccess } from "../helper/response";
import { logger } from "../helper/utility";
import Queue from "better-queue";

/**
 * To handle order creation webhook
 * @param {*} req
 * @param {*} res
 */

export const orderCreated = (req, res) => {
  const shop = req.headres.shop;
  const order = req.body;
  orderCreateQueue.push({ shop, order });
  res.json(respondSuccess("webhook received"));
};

/**
 * To handle order update webhook
 * @param {*} req
 * @param {*} res
 */

export const orderUpdated = (req, res) => {
  console.log(req.body);
  res.send(respondSuccess("webhook received"));
};

/**
 * To handle order delete webhook
 * @param {*} req
 * @param {*} res
 */

export const orderDeleted = (req, res) => {
  res.json(respondSuccess("webhook received"));
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