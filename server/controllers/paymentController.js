import { respondSuccess } from "../helper/response.js"
import { logger } from "../helper/utility.js";

export const mandateData = (req,res) => {
    console.log(req.body)
    logger.info("----------payment  mandate webhook received-----------");
    logger.info(req.body);
    res.send(respondSuccess("webhook received"));
}

export const transactionData = (req,res) => {
    console.log(req.body)
    logger.info("----------payment transaction webhook received-----------");
    logger.info(req.body);
    res.send(respondSuccess("webhook received"));
}