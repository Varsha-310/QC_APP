import { respondInternalServerError, respondSuccess, respondWithData } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import BillingHistory from "../models/BillingHistory.js";

const handleMandateNotification = () => {


}


const sendMandateNotification = () => {


    
}

const handleReccuringPayment = () => {



}

const captureReccuringpayment = () => {


}


/**
 * Send first notification to the marchant
 * 
 * @param {*} store 
 * @param {*} baseAmount 
 * @param {*} capAmount 
 * @returns 
 */
export const firstNotification = (store, baseAmount, capAmount) => {

    console.log("firstNotification");
    return 0;
}

/**
 * send 2nd notification to the marchant
 * 
 * @param {*} store 
 * @param {*} baseAmount 
 * @param {*} capAmount 
 * @returns 
 */
export const secondNotification = (store, baseAmount, capAmount) => {

    console.log("secondNotification");
    return 0;
}

/**
 * Send third notification to the marchnat
 * 
 * @param {*} store 
 * @param {*} baseAmount 
 * @param {*} capAmount 
 * @returns 
 */
export const thiredNotification = (store, baseAmount, capAmount) => {

    console.log("thiredNotification");
    return 0;
}

/**
 * 
 * @param {*} store
 */
export const checkActivePlanUses = async(amount, store_url) => {

    try {
        
        const billingData = await BillingHistory.findOne({store_url, status:"ACTIVE" });
        if(billingData){
            
            let flag = 0;
            const incoming_amount = (parseFloat(billingData.used_credit) + parseFloat(amount)).toFixed(2);
            const total_allowd = (parseInt(billingData.given_credit) + parseInt(billingData.cappedAmount));
            if(parseInt(incoming_amount) >= total_allowd){

                flag = 3;
            }else if(incoming_amount >= (parseFloat(billingData.given_credit) + parseFloat(billingData.cappedAmount)/2)){

                flag = 2;
            }else if(incoming_amount >= billingData.given_credit){
                
                flag = 1;
            }

            console.log("flag:", flag);
            if(flag > 0 && flag == billingData.notifiedMerchant){
                return flag === 3 ? 3 : 0;
            }else{
                
                switch (flag) {
                    case 1:
                        await firstNotification();
                        break;
                    case 2:
                        await secondNotification();
                        break;
                    case 3:
                        await thiredNotification()
                        break;
                }
                billingData.notifiedMerchant = flag;
                await billingData.save();
                return flag === 3 ? 3 : 0;
            }
        }
    } catch (error) {
        
        console.log(error);
        return 4;
    }
    // 0 - active 
    // 1 - crossed base amount
    // 2 - crossed 50% of the cap amount 
    // 3 - crossed 100% of the cap amount
    // 4 - Error Encountered
    //notifyMarchant()
}

/**
 * Update Billing Status
 * 
 * @param {*} amount 
 * @param {*} store_url 
 * @returns 
 */
export const updateBilling = async(amount, store_url) => {

    const billingData = await BillingHistory.findOne({ store_url, status:"ACTIVE" });
    console.log(":", amount, billingData.used_credit);
    if(billingData){
        
        const billing = {
            used_credit: (parseFloat(billingData.used_credit) + parseFloat(amount)).toFixed(2)
        };
        billing.extra_uasge = billing.used_credit - billingData.given_credit;
        billing.extra_usage_amount = ((parseFloat(billing.extra_uasge) * parseFloat(billingData.usage_charge)) / 100).toFixed(2);
        billing.extra_usage_gst = calculateGST(billing.extra_usage_amount);
        billing.total_amount = (parseFloat(billingData.montly_charge) + parseFloat(billing.extra_usage_amount) + parseFloat(billingData.monthly_gst) + parseFloat(billing.extra_usage_gst)).toFixed(2);
        billing.invoiceAmount = billing.total_amount;
        console.log(billing);
        await BillingHistory.updateOne({id: billingData.id}, billing);
        return true;
    }
    return false;
}

/**
 * Calculate GST
 * 
 * @param {*} amount 
 * @returns 
 */
export const calculateGST = (amount) => {

    const gst = process.env.GST_PERCENTAGE || 18;
    return ((parseFloat(amount) * parseFloat(gst))/100).toFixed(2);
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
        return res.json(respondWithData("Success",{billing, total: count}));
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
          status:{ $in: ["ACTIVE", "CHNAGED"] }
        });
        return res.json(respondWithData("Success", billing));
    } catch (err) {
  
        console.log(err);
        return res.json(respondInternalServerError())
    }
}
