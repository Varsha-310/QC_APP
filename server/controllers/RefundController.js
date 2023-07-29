import { respondInternalServerError, respondWithData,respondNotFound, respondError, respondSuccess, respondValidationError } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import axios from "axios";
import orders from "../models/orders.js";
import refundSetting from "../models/refundSetting.js";
import store from "../models/store.js";
import { createGiftcard, reverseRedeemWallet } from "../middleware/qwikcilverHelper.js";
import { addGiftcardtoWallet, giftCardAmount } from "./giftcard.js";

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
 * calculate shopify refund amount from shopify
 * 
 * @param {*} orderId 
 * @param {*} storeUrl
 * @param {*} accessToken 
 * @returns 
 */
const getOrderTransactionDetails = async(orderId, storeUrl, accessToken) => {

    const options = {
        'method': 'GET',
        'url': `https://${storeUrl}/admin/api/2023-04/orders/${orderId}/transactions.json`,
        'headers': {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
        }
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

    console.log("Get Refund Type", refund_type, payment_gateway_names, store_url);
    const setting = await refundSetting.findOne({ store_url });
    if (!setting)  return null;
    const resp = {
        refund_type: refund_type,
        restock_type: setting.restock_type,
        location_id: setting.location_id
    }
    if(refund_type) return resp;
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
const getGCRefundAmount = (refundableAmount, transactions) => {

    //refund with gc
    let gc_rf_amount = 0;
    const gc_trans = transactions.find(item => item.gateway == "gift_card");
    if(!gc_trans) return refundableAmount;

    if(gc_trans.maximum_refundable > refundableAmount){

        gc_rf_amount = refundableAmount;
        gc_trans.amount = refundableAmount;
        refundableAmount = 0;
    }
    else{
        
        gc_rf_amount = gc_trans.maximum_refundable;
        refundableAmount = refundableAmount - gc_rf_amount;
        gc_trans.amount = gc_rf_amount;
    }
    return {gc_trans, refundableAmount, gc_rf_amount};
}

/**
 * Function to calculate and create refund amount
 * @param {*} req
 * @param {*} res
 */
export const handleRefundAction = async (req, res) => {

    try {
    
        // return res.json(respondSuccess("Refund has been initiated"));
        let { orderId, line_items, amount, refund_type } = req.body;
        const {store_url} = req.token;

        //check order
        const ordersData = await orders.findOne({ id: orderId, store_url: store_url });
        if(!ordersData){

            return res.json(respondError("Order Not Found", 422));
        }
        //check taxes
        // const orderQty = ordersData.line_items.reduce((qty,item) => qty+ parseInt(item.quantity),0);
        // const tax = (parseFloat(ordersData.current_total_tax)/ orderQty).toFixed(2); 
        // const refundableQty = line_items.reduce((qty, item) => qty + item.quantity, 0);
        // let totalTaxRefunded= refundableQty * tax;

        const shipping = ordersData?.total_shipping_price_set?.shop_money || {currency: "INR"};
        const storeData = await store.findOne({ store_url });

        const accessToken = storeData.access_token;
        let refundAmount = await callShopifyApiToCalculateRefund(orderId, shipping,line_items, store_url, accessToken);
        refundAmount = refundAmount.data;
        console.log("Refund Calculation", refundAmount);
        // check refundable amount
        const transactions = refundAmount.refund.transactions;
        let refundableAmount = transactions.reduce((prev, item) => prev+ parseFloat(item.maximum_refundable),0);
        //refundableAmount = refundableAmount + totalTaxRefunded;
        
        console.log("Refundable Amout: ", refundableAmount);
        if(amount > refundableAmount){

            return res.json(respondValidationError("The given amount is greater then the maximum refundable amount."));
        }

        const refSetting = await getRefundType(refund_type, ordersData.payment_gateway_names, store_url);
        refund_type = refSetting.refund_type;

        const gcRfDetails = await getGCRefundAmount(amount, transactions);
        const trans = [];

        console.log("GC Refund Details:",refund_type, gcRfDetails);
        
        // process gc reverse transaction
        if(gcRfDetails.gc_rf_amount){

            const getOrderGCAmount = await getOrderTransactionDetails(orderId, store_url, accessToken);
            console.log("Order Transacion", getOrderGCAmount);
            const gc_transaciton = getOrderGCAmount.data.transactions.find(item => item.gateway == "gift_card");
            console.log("Gc_Transaction:", gc_transaciton);
            const gift_gc_id = gc_transaciton.receipt.gift_card_id;
            //await reverseRedeemWallet(store_url, gift_gc_id, gcRfDetails.gc_rf_amount);
            trans.push({
                "kind":"refund",
                "gateway": gcRfDetails.gc_trans.gateway,
                "parent_id": gcRfDetails.gc_trans.parent_id,
                "amount": gcRfDetails.gc_trans.amount
            });
            amount = gcRfDetails.refundableAmount;
        }
       
        if(amount && refund_type == "Back-to-Source"){

            const _trans = transactions.find(item => item.gateway != "gift_card");
            trans.push({
                "kind":"refund",
                "gateway": _trans.gateway,
                "parent_id": _trans.parent_id,
                "amount": amount
            });
        }else if(amount && refund_type == "Store-credit"){

            const giftCardDetails = await createGiftcard(store_url, amount, orderId, 180 );
            console.log( "New Added Giftcard", giftCardDetails );
            const custom_id = ordersData.customer.id == 7286901178670 ? "9709857928" :  ordersData.customer.id;
            await addGiftcardtoWallet( store_url, custom_id, giftCardDetails.CardPin, giftCardDetails.Balance );
            const _trans = transactions.find(item => item.gateway != "gift_card");
            trans.push({
                "kind":"refund",
                "gateway": _trans.gateway,
                "parent_id": _trans.parent_id,
                "amount":0
            });
        }

        // Findal process of the refunds
        const refund_line_items = line_items.map(item => {
            return { line_item_id: item.id, quantity: item.qty, location: refSetting.location_id, restock_type:refSetting.restock_type };
        })
        const refundedResp = await createRefundBackToSource(trans, orderId, refund_line_items, store_url, accessToken,refundAmount.refund.currency);
        console.log(refundedResp.data);
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

    console.log(
        "createRefundBackToSource",
        _trans, orderId, line_items, 
        store_url, accessToken, currency
    );
    const data = {
        "refund": {
            currency: currency,
            notify: true,
            refund_line_items: line_items,
            transactions: _trans
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
  
  
  
