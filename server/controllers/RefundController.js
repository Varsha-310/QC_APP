<<<<<<< HEAD
import { respondInternalServerError, respondWithData,respondNotFound, respondError, respondSuccess, respondValidationError } from "../helper/response";
import { logger } from "../helper/utility";
=======
import { respondInternalServerError, respondWithData,respondNotFound, respondError, respondSuccess } from "../helper/response.js";
import { logger } from "../helper/utility.js";
>>>>>>> 026088699bc4fd24bc8bb661be9d52428a5aa4da
import axios from "axios";
import orders from "../models/orders.js";
import refundSetting from "../models/refundSetting.js";
import store from "../models/store.js";

/**
 * calculate shopify refund amount from shopify
 * 
 * @param {*} orderId 
 * @param {*} data 
 * @param {*} storeUrl 
 * @param {*} accessToken 
 * @returns 
 */
const callShopifyApiToCalculateRefund = async(orderId, shipping,line_items, storeUrl, accessToken) => {

    let data = ({
        "refund": {
            "currency":shipping.currency_code,
            "line_items": line_items,
            "shipping": shipping,
        }
    });
    const options = {
        'method': 'POST',
        'url': `https://${storeUrl}/admin/api/2023-04/orders/${orderId}/refunds/calculate.json`,
        'headers': {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
        },
        "data": JSON.stringify(data)
    };
    return axios(options);
}

/**
 * Hanlde Calculate Refund Amount
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const handleCalculateRefundAmount = async(req, res, next) => {

    try {
        
        console.log("Refund calculation method called", req.body);
        const { orderId, line_items } = req.body;
        const { store_url } = req.token;
        // Verify Orders Details
        const ordersData = await orders.findOne({ id: orderId });
        if(!ordersData){

            return res.json(respondError("Order Not Found", 422));
        }
        const storeData = await store.findOne({ store_url });
        const shipping = ordersData?.total_shipping_price_set?.shop_money || {currency: "INR"};
        const refundAmount = await callShopifyApiToCalculateRefund(orderId, shipping, line_items, store_url, storeData.access_token);
        console.log(refundAmount.data);
        return res.json(respondWithData("Calculated Refund Amount", refundAmount.data));
    } catch (error) {

        logger.info("Error Encountered while Calculating Logs");
        logger.info(error);
        console.log(error);
        return res.json(respondInternalServerError());
    }
}

/**
 * Check Refund Type
 * 
 * @param {*} refund_type 
 * @param {*} paymentMode 
 * @param {*} store_url 
 * @returns 
 */
const getRefundType = async(refund_type, payment_gateway_names, store_url) => {

    if(refund_type) return refund_type;
    const setting = await refundSetting.findOne({ store_url });
    if (!setting)  return null;
    const resp = {
        refund_type: refund_type,
        restock_type: setting.restock_type,
        location_id: setting.location_id
    }
    if(payment_gateway_names.length == 1){

        switch(payment_gateway_names[0]){
            
            case "gift_card":
                resp.refund_type = setting.giftCard;
                break;

            case "manual":
                resp.refund_type = setting.cod;
                break;

            default: 
                resp.refund_type = setting.prepaid;
                break;
        }
    }else{

        const gc = payment_gateway_names.indexOf("gift_card");
        const manual = payment_gateway_names.indexOf("manual");
        console.log('gc', gc,'manual ', manual);
        if((gc>-1) && manual == -1){

            resp.refund_type = setting.giftcard_cash;
        }else
            resp.refund_type = "Back-to-Source";
    }
    return resp;
}

/**
 * Process Refund Amount
 * 
 * @param {*} refundableAmount 
 * @param {*} transactions 
 * @param {*} gc_trans 
 * @returns 
 */
const processGCRefund = (refundableAmount, transactions) => {

    //refund with gc
    const gc_rf_amount = 0;
    const gc_trans = transactions.find(item => item.gateway == "gift_card");
    if(!gc_trans) return refundableAmount;

    if(gc_trans.maximum_refundable > refundableAmount){

        gc_rf_amount = refundableAmount;
        //call reverse redeem method with the gc_rf_amount
    }
    else{
        
        gc_rf_amount = gc_trans.maximum_refundable;
        refundableAmount = refundableAmount - gc_rf_amount;
        //call reverse redeem method with the gc_rf_amount
    }
    return refundableAmount;
}

/**
 * Function to calculate and create refund amount
 * @param {*} req
 * @param {*} res
 */
export const handleRefundAction = async (req, res) => {

    try {
    
        return res.json(respondSuccess("Refund has been initiated"));
        const { orderId, line_items, amount, refund_type } = req.body;
        const {store_url} = req.token;

        //check order
        const ordersData = await orders.findOne({ id: orderId });
        if(!ordersData){

            return res.json(respondError("Order Not Found", 422));
        }

        //check taxes
        const orderQty = ordersData.line_items.reduce((qty,item) => qty+ parseInt(item.quantity),0);
        const tax = (parseFloat(ordersData.current_total_tax)/ orderQty).toFixed(2); 
        const refundableQty = line_items.reduce((qty, item) => qty + item.quantity, 0);
        let totalTaxRefunded= refundableQty * tax;

        const shipping = ordersData?.total_shipping_price_set?.shop_money || {currency: "INR"};
        const storeData = await store.findOne({ store_url });

        const accessToken = storeData.access_token;
        const refundAmount = await callShopifyApiToCalculateRefund(orderId, shipping, store_url, accessToken);
        
        // check refundable amount
        const transactions =refundAmount.transactions;
        let refundableAmount = transactions.reduce((prev, item) => prev+ parseFloat(item.maximum_refundable),0);
        refundableAmount = refundableAmount + totalTaxRefunded;
        
        if(amount > refundableAmount){

            return res.json(respondValidationError("The given amount is greater then the maximum refundable amount."));
        }

        const refSetting = await getRefundType(refund_type, orders.payment_gateway_names, store_url);
        refund_type = refSetting.refund_type;

        refundableAmount = await processGCRefund(refundableAmount, transactions);
        if(refundableAmount && refund_type == "Back-to-Source"){

            const _trans = transactions.find(item => item.gateway != "gift_card");
            _trans.amount = refundableAmount;
            const refund_line_items = line_items.map(item => {
                return { line_item_id: item.id, quantity: item.qty, location: refSetting.location_id, restock_type:refSetting.restock_type };
            })
            await createRefundBackToSource(_trans, orderId, refund_line_items, store_url, accessToken,refundAmount.currency);
              
        }else{

            // call create new giftcard with the refudable Amount;
        }
        ordersData.Refund_Mode = refund_type;
        ordersData.save();
        return res.json(respondSuccess("Refund has been initiated"));
    } catch (err) {
        
        console.error(err);
        logger.info(err)
        res.json(respondInternalServerError());
    }
}


/**
 * Function to create refund amount
 * @param {*} id
 * @param {*} store_url
 * @param {*} refundAmount
 * @param {*} restock_type
 * @param {*} storeData
 * @param {*} accessToken
 */
export const createRefundBackToSource = async (_trans, orderId, line_items, store_url, accessToken, currency) => {

    const data = {
        "refund": {
            currency: currency,
            notify: true,
            refund_line_items: line_items,
            transactions: [_trans]
        }
    };
    const options = {

        method: "POST",
        url: `https://${store_url}/admin/api/2023-04/orders/${orderId}/refunds.json`,
        headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
        },

        data: JSON.stringify(data)
    }
    return axios(options);
}  

/**
 * To handle refund settings
 * @param {*} req
 * @param {*} res
 */

// Function to handle the refund
export const getConfigapi = async (req, res) => {

    try {
  
      let { store_url } = req.token;
      console.log(store_url);
      const settings = await refundSetting.findOne({ store_url });
      res.json(respondWithData("Success", settings));
    } catch (err) {
  
      console.log(err);
      logger.info(err);
      res.json( respondInternalServerError() );
    }
  };
  
  /**
   * To handle refund update settings 
   * @param {*} req
   * @param {*} res
   */
  
  export const updateConfigapi = async (req, res) => {
  
    try {
  
      const { store_url } = req.token;
      const { prepaid, cod, giftCard, giftcard_cash, restock_type, location_id } = req.body;
      const updatedSettings = await refundSetting.findOneAndUpdate(
        { store_url },
        {
          $set: {
            prepaid,
            cod,
            giftCard,
            giftcard_cash,
            restock_type,
            location_id,
          },
        },
        { upsert: true }
      );
      res.json(respondWithData("updated successfully",updatedSettings));
    } catch (err) {
  
      console.error(err)
      res.json(respondInternalServerError());
    }
};
  
  
  
