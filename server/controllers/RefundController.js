import { respondInternalServerError, respondWithData,respondNotFound, respondError, respondSuccess, respondValidationError } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import axios from "../helper/axios.js";
import orders from "../models/orders.js";
import refundSetting from "../models/refundSetting.js";
import store from "../models/store.js";
import { createGiftcard, cancelRedeemWallet, checkWalletOnQC, createWallet, loadWalletAPI, cancelCreateNdIssueGiftcard, cancelLoadWalletAPI } from "../middleware/qwikcilver.js";
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
        refundableAmount = 0;
    }
    else{
        
	    console.log("Inside Partial Refundable");
        gc_rf_amount = gc_trans.maximum_refundable;
        refundableAmount = refundableAmount - gc_rf_amount;
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
const checkRefundSession = async(orderId, store_url, refund_id, refundableAmount) => {

    const refundSession = await RefundSession.findOne({"logs.id": refund_id});
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
    const logs = refundSession.logs.find(log => log.id == refund_id && item.status == "in-process");
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
 * Refund amount as store credit
 * 
 * @param {*} store 
 * @param {*} ordersData 
 * @param {*} amount 
 * @param {*} logs 
 * @returns 
 */
const refundAsStoreCredit = async (store, ordersData, amount, logs) => {

    try {
        
        logs["status"] = false;
        console.log("------------------------ Store Credit Process Started -------------------");
        const  type = "refund";
     
        // Check And Create Wallet;
        const checkWallet = {}
        if(!logs?.checkWallet.status){

            checkWallet = await checkWalletOnQC(store, ordersData.customer.id, logs?.checkWallet);
            logs["checkWallet"] = checkWallet;
        }
        if(!checkWallet.status){

            const createWalletOnQc = await createWallet(store, ordersData.customer.id, ordersData.id, logs?.createWallet);
            logs["createWallet"] = createWalletOnQc;
            if(!createWalletOnQc.status) throw Error("Error: Creating Wallet On WC");
        }

        //Create Gift Card
        if(!logs?.createCard?.status) {
            const logsGC = await createGiftcard(store_url, amount, orderId, 180, type,ordersData.customer, logs?.createGC);
            logs["createGC"] = logsGC;
            if(!logsGC.status) throw new Error("Error: Create Gift Card");
        }
        const giftCardDetails =  logs["createGC"].resp.Cards[0];

        // Activate and add card to wallet using load wallet api.
        if(!logs?.loadGC?.status){

            const loadGC = await loadWalletAPI(store, giftCardDetails.Balance, ordersData.id, ordersData?.customer.id, logs?.loadGC);
            logs["loadWallet"] = loadGC;
            if(!loadGC.status) throw new Error("Error: Load Wallet API");
        }
        logs["status"] = true;
        return logs;
    } catch (error) {
        
        console.log(error);
        logs["error"] = error;
        return logs;
    } 
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
        let { orderId, line_items, amount, refund_type, retry_id } = req.body;

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

        const shipping = ordersData?.total_shipping_price_set?.shop_money || {currency: "INR"};
        const storeData = await store.findOne({ store_url });

        const accessToken = storeData.access_token;
        let refundAmount = await callShopifyApiToCalculateRefund(orderId, shipping,line_items, store_url, accessToken);
        refundAmount = refundAmount.data;
        //console.log("----------------- Refund Calculation ----------------", JSON.stringify(refundAmount));
        
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
        //console.log(`Refundable Amout: ${refundableAmount}, Total Tax Refunded: ${totalTaxRefunded}`);

        let refundSession = await checkRefundSession(orderId, store_url, retry_id, refundableAmount);
        const refundedAmount = refundSession.refundedAmount;
        refundSession = refundSession.logs;
        if( retry_id && Object.keys(refundSession).length == 0){

            return res.json(respondValidationError("No active session found on the given retry Id"));
        }
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
            total: amount
        }
        
	    const trans = [];
        let storeCredit = 0;
        //process gc reverse transaction
        if(refund_type == "Back-to-Source"){

            const gcRfDetails = await getGCRefundAmount(amount, transactions);
            console.log("GC Refund Details:", gcRfDetails);
            if(gcRfDetails.refundableAmount){

                console.log("------------------------ Back To sourc Process Started -------------------");
                const _trans = transactions.find(item => item.gateway != "gift_card");
                _trans && trans.push({
                    "kind":"refund",
                    "gateway": _trans.gateway,
                    "parent_id": _trans.parent_id,
                    "amount": gcRfDetails.refundableAmount
                });
            }
            if(gcRfDetails.gc_rf_amount){

                const gc_transaciton = transactions.find(item => item.gateway == "gift_card");
                gc_transaciton && trans.push({
                    "kind":"refund",
                    "gateway": gc_transaciton.gateway,
                    "parent_id": gc_transaciton.parent_id,
                    "amount": gcRfDetails.gc_rf_amount
                }); 
                storeCredit =  gcRfDetails.gc_rf_amount;
            }     
            refundSession = await updateRefundLogs(sessionQuery, {  
                amount: gcRfDetails.refundableAmount,
                gc_amount: gcRfDetails.gc_rf_amount,
                ...logs
            });
            sessionQuery["logs.id"] = refundSession.id;          
        }
        if(refund_type == "Store-credit"){

            storeCredit = amount;
            trans.push({
                "kind":"refund",
                "gateway": "store-credit",
                "amount": 0
            });
        }

        // Process Store Credit As Refund
        if(storeCredit && !refundSession?.storeCredit.status){

            const logs1 = await refundAsStoreCredit(store, ordersData, storeCredit, refundSession?.storeCredit);
            if(!logs1.status && refundSession.retries == 3){

                const scLogs = logs1;
                const voidGC = scLogs?.voidGC && await cancelCreateNdIssueGiftcard(store, scLogs?.createGC?.resp, scLogs?.voidGC);
                scLogs["voidGC"] = voidGC;
                const voidLoadWallet = scLogs?.voidLW && await cancelLoadWalletAPI(store, scLogs?.loadWallet?.resp, scLogs?.voidLW);
                scLogs["voidLW"] = voidLoadWallet;
                refundSession = await updateRefundLogs(sessionQuery, {  
                    storeCredit: scLogs,
                    status: "Failed",
                    ...logs
                });
                return res.json(respondSuccess("Server Is not responding properly, Try After Some time"));
            }
            refundSession = await updateRefundLogs(sessionQuery, {  
                storeCredit: logs1,
                ...logs
            });
            sessionQuery["logs.id"] = refundSession.id;
            if(logs1 && (!logs1.status)) throw Error("Error while reversing the amount");  
        }

        // Findal process of the refunds
        if(!refundSession?.refund_created_at){

            console.log(" ------ Create Refund Method called ----- ");
            const refund_line_items = line_items.map(item => {
                return { line_item_id: item.id, quantity: item.qty, location_id: refSetting.location_id, restock_type:refSetting.restock_type };
            })
            const refundedResp = await createRefundBackToSource(trans, orderId, refund_line_items, store_url, accessToken,refundAmount.refund.currency, amount);
            console.log(refundedResp.data, " Query : ", sessionQuery);
            refundSession = await updateRefundLogs(sessionQuery, {
                refund_created_at: new Date(),
                status: "completed"
            });
            ordersData.refund_status = (parseFloat(amount)+ parseFloat(refundedAmount)) >= refundableAmount ? "Refunded" : "Partially refunded";
        }
       
        // if(refundSession?.order_updated_at){
            
        //     const existingNotes = ordersData.note_attributes || [];
        //     existingNotes.push({

        //     });
        //     const refundedResp = await updateOrderNotes(orderId,store_url,accessToken,refundSession.id, refundAmount.refund.currency, );
        // }
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
            transactions: _trans,
            note: `${currency} ${amount} Refunded As QC Store Credit`
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