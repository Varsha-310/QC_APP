import { respondSuccess } from "../helper/response";
import { logger } from "../helper/utility";
import Queue from "better-queue";

/**
 * To handle order creation webhook
 * @param {*} req
 * @param {*} res
 */
export const orderCreated = (req, res) => {
   orderCreateQueue(req,res); 
  res.json(respondSuccess("webhook received"));
};

/**
 * To handle order update webhook
 * @param {*} req
 * @param {*} res
 */
export const orderUpdated = (req, res) => {
  res.json(respondSuccess("webhook received"));
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
 * Queue to handle webhooks 
 */
const orderCreateQueue = new Queue(ordercreateEvent, { maxRetries: 2, retryDelay: 1000 });

/**
 * Handle order create event
 * @param {*} req 
 * @param {*} res 
 */
const ordercreateEvent= (req,res) => {
    try{
        
    }
    catch (err) {
        console.log(err);
        logger.info(err);
        res.json(
          respondInternalServerError("Something went wrong try after sometime")
        );
      }

}

