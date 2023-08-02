import { respondInternalServerError, respondSuccess, respondWithData } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import BillingHistory from "../models/BillingHistory.js";

const handleMandateNotification = () => {

    
}

const verifyTransaction = () => {


}

const sendMandateNotification = () => {


    
}

const handleReccuringPayment = () => {



}

const captureReccuringpayment = () => {


}
/**
 * Handle Payment Callback Webhook
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const handleCallbackWebhook = (req, res) => {

    try {
        
        return res.json(respondSuccess())
    } catch (error) {
        
        logger.error(error);
        console.log(error);
        return res.json(respondInternalServerError());
    }
} 

/**
 * Hanldle Billing List Request
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const handleBillingList = async(req, res) => {

    try {
       
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 20;
        let skip = (page - 1) * limit;
        const storeUrl = req.token.store_url;
        const billing = await BillingHistory.find({ store_url: storeUrl, status: "BILLED"})
            .skip(skip)
            .limit(limit);
        const count = await BillingHistory.countDocuments({ store_url: storeUrl, status: "BILLED"}); 
        return res.json(respondWithData("Success",{billing, total: count}))
    } catch (err) {

        console.log(err);
       return res.json(respondInternalServerError())
    }
}


/**
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const handleBillingDetails = async(req, res) => {

    try {
     
        const { invoiceNumber } = req.body;
        const {store_url } = req.token;
        const billing = await BillingHistory.findOne({
          store_url,
          status: "ACTIVE"
        });
        return res.json(respondWithData("Success", billing));
    } catch (err) {
  
        console.log(err);
        return res.json(respondInternalServerError())
    }
}
