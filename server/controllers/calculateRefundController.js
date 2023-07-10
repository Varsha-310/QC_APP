import { respondInternalServerError, respondWithData,respondNotFound, respondError } from "../helper/response";
import { logger } from "../helper/utility";
import axios from "axios";
import orders from "../models/orders";
import refundSetting from "../models/refundSetting";
import store from "../models/store";

/**
 * Function to calculate and create refund amount
 * @param {*} req
 * @param {*} res
 */



export const createRefundAmount = async (req, res) => {
    try {
        const {store_url} = req.token;
        const { id } = req.body; 
        const storeData = await store.findOne({ store_url });
        const accessToken = storeData.access_token;   
        const refundAmount = await calculateRefund(id, store_url,storeData,accessToken );
         
        //checking setting for store
        const setting = await refundSetting.findOne({ store_url });
        if (!setting) {
            return res.json(respondError("store_url invalid", 404))
        }

        if (setting.prepaid === "Back-to-Source" || setting.cod === "Back-to-Source" ||
            setting.giftCard === "Back-to-Source" || setting.giftcard_cash === "Back-to-Source") {

            if (setting.restock_type === "no_restock") {
                const refundResponse = await createRefund(id, store_url, refundAmount, setting.restock_type, storeData, accessToken);
                return res.json(respondWithData("Success",200, refundResponse));
            }
            else if (setting.restock_type === "return") {
                if (!setting.location_id) {
                    return res.json(respondError("Location ID is required to create a refund", 404));
                }
                const refundResponse = await createRefund(id, store_url, refundAmount, setting.restock_type, storeData, accessToken);
                
                return res.json(respondWithData("Success",200,refundResponse));
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

        const options = {
            'method': 'POST',
            'url': `https://${store_url}/admin/api/2023-04/orders/${id}/refunds/calculate.json`,
            'headers': {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json'
            },
            "data": JSON.stringify(data)
        };
        const result = await axios(options);
        return result;
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
