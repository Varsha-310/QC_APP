import { respondInternalServerError, respondWithData,respondNotFound, respondError, respondSuccess } from "../helper/response.js";
import { logger } from "../helper/utility.js";
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
const callShopifyApiToCalculateRefund = async(orderId, data, storeUrl, accessToken) => {

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
        const storeData = await store.findOne({ store_url });
        // Verify Orders Details
        const ordersData = await orders.findOne({ id: orderId });
        if(!ordersData){

            return res.json(respondError("Order Not Found", 422));
        }
        const shipping = ordersData?.total_shipping_price_set?.shop_money || {currency: "INR"};
        let data = ({
            "refund": {
                "currency":shipping.currency_code,
                "line_items": line_items,
                "shipping": shipping,
            }
        });
        const refundAmount = await callShopifyApiToCalculateRefund(orderId, data, store_url, storeData.access_token);
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
 * Function to calculate and create refund amount
 * @param {*} req
 * @param {*} res
 */
export const handleRefundAction = async (req, res) => {

    try {
    

        return res.json(respondSuccess("Refund has been initiated"));
        const {store_url} = req.token;
        const { id } = req.body; 
        const storeData = await store.findOne({ store_url });
        const accessToken = storeData.access_token;
        const refundAmount = await calculateRefund(id, store_url, storeData, accessToken );
         
        //checking setting for store
        const setting = await refundSetting.findOne({ store_url });
        if (!setting) {
    
            return res.json(respondError("Configure Your Refund Setting", 422));
        }

        if (setting.prepaid === "Back-to-Source" || setting.cod === "Back-to-Source" ||
            setting.giftCard === "Back-to-Source" || setting.giftcard_cash === "Back-to-Source") {

            if (setting.restock_type === "no_restock") {

                const refundResponse = await createRefund(id, store_url, refundAmount, setting.restock_type, storeData, accessToken);
                return res.json(respondWithData("Success",refundResponse));
            }
            else if (setting.restock_type === "return") {
                if (!setting.location_id) {
                    return res.json(respondError("Location ID is required to create a refund", 404));
                }
                const refundResponse = await createRefund(id, store_url, refundAmount, setting.restock_type, storeData, accessToken);
                
                return res.json(respondWithData("Success",refundResponse));
            }     
        }
        res.json(respondNotFound("Invalid payment mode", 404));

        // const finaldata = await calculateRefund(req,res);
        // res.send(finaldata.data);
    } catch (err) {
        
        console.error(err);
        logger.info(err)
        res.json(respondInternalServerError());
    }
}

/**
 * Function to calculate refund amount
 * @param {*} id
 * @param {*} store_url
 * @param {*} storeData
 * @param {*} accessToken
 */

export const calculateRefund = async (id, store_url, storeData, accessToken) => {

    try {
        const allData = await orders.find({ id: id });
        const lineItemId = allData[0].line_items;
        const shipping = allData[0].total_shipping_price_set.shop_money;
        const calculateLineItems = lineItemId.map((lineItem) => ({
            line_item_id: lineItem.id,
            quantity: lineItem.quantity
        }));
        let data = ({
            "refund": {
                "currency":shipping.currency_code,
                "line_items": calculateLineItems ,
                "shipping": shipping,
            }
        });

     
    }
    catch (err) {
        console.log(err);
        return null;
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
export const createRefund = async (id, store_url,refundAmount, restock_type, storeData, accessToken) => {

    try {


        const allData = await orders.find({ id: id });
        const lineItemId = allData[0].line_items;
        // const location_id = allData[0].location_id;
        const currency =  allData[0].total_shipping_price_set.shop_money.currency_code
       
        const refundLineItems = lineItemId.map((lineItem) => ({
            line_item_id: lineItem.id,
            quantity: lineItem.quantity,
            restock_type: restock_type,
            // location_id: location_id,
        }));
        const data = {
            "refund": {
                currency: currency,
                notify: true,
                shipping: {
                    full_refund: true,
                },
                refund_line_items: refundLineItems,
            },
        };
        
        const options = {
            method: "POST",
            url: `https://${store_url}/admin/api/2023-04/orders/${id}/refunds.json`,
            headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
            },

            data: JSON.stringify(data)
        }
        const response = await axios(options);
        const result = response.data
        return result;
    }
    catch (err) {
        console.error(err)
        return null
    }
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
      if (restock_type === 'return') {
        if (!location_id) {
          return res.json(respondError("Location id is required to create a refund", 404));
        }
      }
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
  
  
  
