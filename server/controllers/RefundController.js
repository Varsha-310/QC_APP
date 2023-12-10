import { respondInternalServerError, respondWithData,respondNotFound, respondError, respondSuccess, respondValidationError } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import axios from "../helper/axios.js";
import orders from "../models/orders.js";
import refundSetting from "../models/refundSetting.js";
import store from "../models/store.js";
import { createGiftcard, cancelRedeemWallet } from "../middleware/qwikcilver.js";
import { addGiftcardtoWallet, giftCardAmount } from "./giftcard.js";
import RefundSession from "../models/RefundSession.js";
import { checkActivePlanUses } from "./BillingController.js";

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
        
        // Fetch Refundable Amount From Shopify
        const refundAmount = await callShopifyApiToCalculateRefund(orderId, shipping, line_items, store_url, storeData.access_token);
        return res.json(respondWithData("Calculated Refund Amount", refundAmount.data));
    } catch (error) {

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
    console.log("Refund Settings:", setting);
    if (!setting)  return null;
    const resp = {
        refund_type: refund_type,
        restock_type: setting.restock_type,
        location_id: setting.location_id,
        cod_con: ""
    }
    if(refund_type) return resp;
    if(payment_gateway_names.length == 1){

        switch(payment_gateway_names[0]){
            
            case "gift_card":
                resp.refund_type = setting.giftCard;
                break;

            case "manual":
                resp.refund_type = setting.cod;
                resp.cod_con = "cod_wothout_gc";
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
        }else{

            resp.refund_type = "Back-to-Source";
            resp.cod_con = "cod_woth_gc";
        }
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

     console.log("--------------- Get GC Refund AMOUNT -------------------");
    //refund with gc
    let gc_rf_amount = 0;
    const gc_trans = transactions.find(item => item.gateway == "gift_card");
    if(!gc_trans) return refundableAmount;
 
    console.log("Gift Card Transaction", gc_trans);
    if(parseFloat(gc_trans.maximum_refundable) >  parseFloat(refundableAmount)){

	    console.log("Inside Full refundable");
        gc_rf_amount = refundableAmount;
        gc_trans.amount = refundableAmount;
        refundableAmount = 0;
    }
    else{
        
	    console.log("Inside Partial Refundable");
        gc_rf_amount = gc_trans.maximum_refundable;
        refundableAmount = refundableAmount - gc_rf_amount;
        gc_trans.amount = gc_rf_amount;
    }
    console.log("GC refundavle AMount", gc_rf_amount);
    return {gc_trans, refundableAmount, gc_rf_amount};
}

/**
 * Update Logs
 * 
 * @param {*} query 
 * @param {*} logs 
 * @returns 
 */
const updateRefundLogs = async(query, logs) => {

    console.log("------------------------ Refund Logs ----------------------------");
    console.log("Id: ", logs?.id);
    if(query["logs.id"] == undefined){
        
        delete query["logs.id"];
        logs["id"] = Date.now() + Math.random().toString(10).slice(2, 7);
        console.log("Update: ", query, logs);
        await RefundSession.updateOne(query, {
            $push: {
                "logs": logs
            }
        }).then(res => console.log(res));
    }
    else{
        
        const data = {};
        for (const key in logs) {
            if (Object.hasOwnProperty.call(logs, key)) {
                data[`logs.$.${key}`] = logs[key];   
            }
        }
	    logs["id"] = query["logs.id"];
        console.log("Push: ", query, logs, data);
        await RefundSession.updateOne(query, data).then(res => console.log(res));
    }
    return logs;
}

/**
 * Fetch active refund session
 * 
 * @param {*} orderId 
 * @param {*} store_url 
 * @param {*} refund_type 
 * @returns 
 */
const checkRefundSession = async(orderId, store_url, refund_type, refundableAmount) => {

    const refundSession = await RefundSession.findOne({
        order_id: orderId, store_url: store_url
    });
    console.log('isRefundSessionExists', refundSession);
    if(!refundSession){

        await RefundSession.create({
            order_id: orderId, 
            store_url: store_url, 
            refundable_amount: refundableAmount
        });
        return {
            logs: {},
            refundedAmount: 0
        };
    }
    const logs = refundSession.logs.find(log => log.status == "in-process" && log.refund_type == refund_type);
    const amount =  refundSession.logs.reduce((prev, item) => {

        if(item.refund_type == "Store-credit" && ["in-process", "completed"].includes(item.status)){

            return prev + parseFloat(item.amount);
        }
        return prev; 
    }, 0);
    return {
        logs: logs ? logs : {},
        refundedAmount: amount
    };
}

/**
 * Function to calculate and create refund amount
 * 
 * @param {*} req
 * @param {*} res
 */
export const handleRefundAction = async (req, res) => {

    try {
        
        console.log("=================== Refund Process Started ===================");
        // return res.json(respondSuccess("Refund has been initiated"));
        let { orderId, line_items, amount, refund_type } = req.body;

        const {store_url} = req.token;
        const flag = await checkActivePlanUses(amount, store_url);
        if(flag > 0){

            const msg = flag == 3 ? respondError("Plan limit has been exceeded. Please upgrade your plan.", 422) : respondInternalServerError();
            return res.json(msg);
        }

        //check order
        const ordersData = await orders.findOne({ id: orderId, store_url: store_url });
        if(!ordersData){

            return res.json(respondError("Order Not Found", 422));
        }
        
        let totalTaxRefunded = parseFloat(ordersData.current_total_tax);

        const shipping = ordersData?.total_shipping_price_set?.shop_money || {currency: "INR"};
        const storeData = await store.findOne({ store_url });

        const accessToken = storeData.access_token;
        let refundAmount = await callShopifyApiToCalculateRefund(orderId, shipping,line_items, store_url, accessToken);
        refundAmount = refundAmount.data;
        console.log("----------------- Refund Calculation ----------------", JSON.stringify(refundAmount));
        
        // check refundable amount
        const transactions = refundAmount.refund.transactions;
        let refundableAmount = transactions.reduce((prev, item) => prev+ parseFloat(item.maximum_refundable),0);
        //refundableAmount = refundableAmount + totalTaxRefunded;  

        const refSetting = await getRefundType(refund_type, ordersData.payment_gateway_names, store_url);
        refund_type = refSetting.refund_type;
        console.log("------------- Refund Settings Details ------------", refSetting);
        //check refundable type
        if(!refund_type){

            return res.json(respondValidationError("Please select or update the refund type."));
        }
        //check cod payment Method 
        if(refSetting.cod_con == "cod_without_gc" && refund_type == "Back-to-Source"){

            return res.json(respondValidationError("The cod order is not able to process with the back to source option"));
        }
        console.log("Refund Type: ", refund_type);
        console.log(`Refundable Amout: ${refundableAmount}, Total Tax Refunded: ${totalTaxRefunded}`);

        let refundSession = await checkRefundSession(orderId, store_url, refund_type, refundableAmount);
        const refundedAmount = refundSession.refundedAmount;
        refundSession = refundSession.logs;
        console.log("Refundable Amout: ", refundableAmount, "Amount: ", amount, "Refunded Amount:", refundedAmount);
        
        if((parseFloat(amount)+ parseFloat(refundedAmount)) > refundableAmount){

            return res.json(respondValidationError("The given amount is greater then the maximum refundable amount."));
        }
        const sessionQuery = {
            order_id: orderId, store_url, 
            "logs.id": refundSession?.id
        };
        const logs = {
            refund_type: refund_type,
            amount: amount
        }
        const gcRfDetails = await getGCRefundAmount(amount, transactions);
	    const trans = [];
        console.log("GC Refund Details:", gcRfDetails);
        
        //process gc reverse transaction
        if(gcRfDetails.gc_rf_amount && (!refundSession?.gc_refunded?.status)){

            console.log("------------------------ Gift card Refund Process Started -------------------");
            const getOrderGCAmount = await getOrderTransactionDetails(orderId, store_url, accessToken);
            const gc_transaciton = getOrderGCAmount.data.transactions.find(item => item.gateway == "gift_card");
            const gift_gc_id = gc_transaciton.receipt.gift_card_id;
            const logs1 = await cancelRedeemWallet(store_url, gift_gc_id, gcRfDetails.gc_rf_amount,ordersData.id, ordersData.redeem_txn_id,refundSession?.gc_refunded);
            refundSession = await updateRefundLogs(sessionQuery, {
                "gc_refunded": logs1,
                "gc_rf_amount": gcRfDetails.gc_rf_amount,
                ...logs
            })
            sessionQuery["logs.id"] = refundSession.id;
            if(!logs1.status) throw Error("Error while reversing the amount");
            trans.push({
                "kind":"refund",
                "gateway": gcRfDetails.gc_trans.gateway,
                "parent_id": gcRfDetails.gc_trans.parent_id,
                "amount": gcRfDetails.gc_trans.amount
            });
            amount = gcRfDetails.refundableAmount;
        }
       
        if(amount && refund_type == "Back-to-Source" && (!refundSession?.other_rf_at) && refSetting.cod_con != "cod_woth_gc"){

            console.log("------------------------ Back To sourc Process Started -------------------");
            const _trans = transactions.find(item => item.gateway != "gift_card");
            trans.push({
                "kind":"refund",
                "gateway": _trans.gateway,
                "parent_id": _trans.parent_id,
                "amount": amount
            });
            refundSession = await updateRefundLogs(sessionQuery, {
                other_rf_at: new Date(),
                other_rf_amount: amount,
                ...logs
            });
            sessionQuery["logs.id"] = refundSession.id;
            console.log(" --- logs Back To sourc --- ", sessionQuery);
        }else if(amount && refund_type == "Store-credit"){

            console.log("------------------------ Store Credit Process Started -------------------");
            const  type = "refund";
            let giftCardDetails = {};
            let logData = refundSession?.qc_gc_created || {};
            if(!refundSession?.qc_gc_created?.createGC?.status){

                const logsGC = await createGiftcard(store_url, amount, orderId, 180, type,ordersData.customer , refundSession?.qc_gc_created?.createGC);
                logData["createGC"] = logsGC;
                refundSession = await updateRefundLogs(sessionQuery, {
                    qc_gc_created: logData,
                    qc_gc_amount: amount,
                    ...logs
                });
                sessionQuery["logs.id"] = refundSession.id;
	            console.log(" --- logs createGC --- ", sessionQuery);
                if(!logsGC.status) throw new Error("Error: Create Gift Card");
                giftCardDetails = logsGC.resp.Cards[0];
            }
            if(!refundSession?.qc_gc_created?.wallet?.status){

                const logsGC = await addGiftcardtoWallet( store_url, ordersData.customer.id, giftCardDetails.CardPin, giftCardDetails.Balance , type,orderId, refundSession?.qc_gc_created?.wallet);
                logData["wallet"] = logsGC;
                refundSession = await updateRefundLogs(sessionQuery, {
                    qc_gc_created: logData,
                    qc_gc_amount: amount,
                    ...logs
                });
                sessionQuery["logs.id"] = refundSession.id;
		        console.log("Refund Logs", refundSession);
                console.log(" ---logs wallet --- ", sessionQuery);
                if(!logsGC.status) throw new Error("Error: Create Gift Card");
            }
            const _trans = transactions.find(item => item.gateway != "gift_card");
            trans.push({
                "kind":"refund",
                "gateway": _trans.gateway,
                "parent_id": _trans.parent_id,
                "amount":0
            });
        }
        // Findal process of the refunds
        if(!refundSession?.refund_created_at){

            console.log(" ------ Create Refund Method called ----- ");
            const refund_line_items = line_items.map(item => {
                return { line_item_id: item.id, quantity: item.qty, location_id: refSetting.location_id, restock_type:refSetting.restock_type };
            })
            const refundedResp = await createRefundBackToSource(trans, orderId, refund_line_items, store_url, accessToken,refundAmount.refund.currency);
            console.log(refundedResp.data, " Query : ", sessionQuery);
            refundSession = await updateRefundLogs(sessionQuery, {
                refund_created_at: new Date(),
                status: "completed"
            });
            ordersData.refund_status = (parseFloat(amount)+ parseFloat(refundedAmount)) > refundableAmount ? "Refunded" : "Partially refunded";
        }
       
        // if(refundSession?.order_updated_at){
        //     const refund_line_items = line_items.map(item => {
        //         return { line_item_id: item.id, quantity: item.qty, location: refSetting.location_id, restock_type:refSetting.restock_type };
        //     })
        //     const refundedResp = await updateOrderNotes(orderId,store_url,accessToken,refundSession.id, refundAmount.refund.currency, );
        //     console.log(refundedResp.data);
        //     ordersData.Refund_Status = "";
        // 
        ordersData.Refund_Mode = refund_type;
        ordersData.save();
        const msg = refSetting.cod_con == "cod_woth_gc"  ? "Refund has been initiated only for the gift card amount." : "Refund has been initiated";
        return res.json(respondSuccess(msg));
    } catch (err) {
        
        console.error(err);
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
 * Update Order Notes
 * 
 * @param {*} orderId 
 * @param {*} store_url 
 * @param {*} accessToken 
 * @param {*} session_id 
 * @param {*} currency 
 * @param {*} amount 
 * @returns 
 */
export const updateOrderNotes = async ( orderId, store_url, accessToken, session_id, currency, amount) => {

    const options = {

        method: "POST",
        url: `https://${store_url}/admin/api/2023-04/orders/${orderId}.json`,
        headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
        },

        data: JSON.stringify({
            "order": {
                id: orderId,
                "note_attributes": [{
                    "name": `QC-Refund-Sesson: ${session_id}`,
                    "value": `${currency} ${amount}`
                }]
            }
        })
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
  


export const getRefundLogs = (req, res) => {


}