import { respondInternalServerError, respondWithData, respondError } from "../helper/response";
import { logger } from "../helper/utility";
import axios from "axios";
import orders from "../models/orders";
import refundSetting from "../models/refundSetting";
import store from "../models/store";

/**{message:"Refund created successfully", data: refundResponse}
 * Function to calculate and create refund amount
 * @param {*} req
 * @param {*} res
 */

export const createRefundAmount = async (req, res) => {
    try {
        const { id, store_url } = req.body;
        const refundAmount = await calculateRefund(id, store_url);

        //checking setting for store
        const setting = await refundSetting.findOne({ store_url });

        if (!setting) {
            return res.json(respondError("Invalid or wrong url entered"))
        }

        if (setting.prepaid === "Back-to-Source" || setting.COD === "Back-to-Source" ||
            setting.GiftCard === "Back-to-Source" || setting.giftcard_cash === "Back-to-Source") {

            if (setting.restock_type === "no_restock") {

                const refundResponse = await createRefund(id, store_url, refundAmount, setting.restock_type);
                return res.json(respondWithData(refundResponse));
            }
            else if (setting.restock_type === "return") {
                if (!setting.location_id) {
                    return res.json(respondError("Location ID is required to create a refund"));
                }
                const refundResponse = await createRefund(id, store_url, refundAmount, setting.restock_type);
                return res.json(respondWithData(refundResponse));
            }
        }
        res.json(respondNotFound("Invalid payment mode"));

        // const finaldata = await calculateRefund(req,res);
        // res.send(finaldata.data);
    } catch (err) {
        console.error(err);

        res.json(respondInternalServerError());
    }
}


export const calculateRefund = async (id, store_url,) => {

    try {
        const storeData = await store.findOne({ store_url });
        const accessToken = storeData.access_token;

        const allData = await orders.find({ id: id });
        const lineItemId = allData[0].line_items[0].id;
        const shipping = allData[0].total_shipping_price_set.shop_money;

        let data = ({
            "refund": {
                "line_items": { id: lineItemId },
                "shipping": shipping
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

export const createRefund = async (id, store_url, refundAmount, restock_type) => {
    try {
        const storeData = await store.findOne({ store_url });
        const accessToken = storeData.access_token;
        const allData = await orders.find({ id: id });

        const lineItemId = allData[0].line_items;
        const location_id = allData[0].location_id;
        const refundLineItems = lineItemId.map((lineItem) => ({
            line_item_id: lineItem.id,
            quantity: lineItem.quantity,
            restock_type: restock_type,
            location_id: location_id
        }));

        // const quantityData = allData[0].line_items[0].quantity;
        const data = {
            "refund": {
                currency: "INR",
                notify: true,
                shipping: {
                    full_refund: false,
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
