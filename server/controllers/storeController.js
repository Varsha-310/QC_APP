import { respondInternalServerError } from "../helper/response";
import { logger } from "../helper/utility";
import orderdetail from "../models/orders"

/**
 * Function to handle pagination and filter the data according to store url.
 * @param {*} req
 * @param {*} res
 */

export const getStoresData = async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 20;
        let skip = (page - 1) * limit;

        const storeUrlFilter = { store_url: req.query.store_url };
        const storeData = await orderdetail.findOne(storeUrlFilter);
    
        if (!storeData) {
            return res.json({ message: "No matching store found." });
        }

        const refundModeFilter = { Refund_Mode: req.query.Refund_Mode };
       
        const paymentGatewayFilter = { payment_gateway_names: req.query.payment_gateway_names };
      
        const filter = { ...storeUrlFilter };
        

        if (req.query.Refund_Mode) {
            filter.Refund_Mode = req.query.Refund_Mode;
        }
        

        if (req.query.payment_gateway_names) {
            filter.payment_gateway_names = req.query.payment_gateway_names;
        }

        const orders = await orderdetail.find(filter)
            .skip(skip)
            .limit(limit);

        if (orders.length === 0) {
            return res.json({ message: "No matching data found." });
        }

        res.json(orders);

    } catch (err) {
        logger.info(err);
        res.json(
            respondInternalServerError("Something went wrong try after sometime")
        );
    }
};