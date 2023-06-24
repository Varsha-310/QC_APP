import { respondWithData, respondInternalServerError } from "../helper/response";
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

        const storeUrl = req.token.store_url;
        const storeUrlFilter = { store_url: storeUrl };


        // Fetch all the data present in the particular store 

        const filter = { ...storeUrlFilter }

        if (req.query.Refund_Mode) {
            filter.Refund_Mode = req.query.Refund_Mode;
        }
        if (req.query.payment_gateway_names) {
            filter.payment_gateway_names = req.query.payment_gateway_names;
        }
        const orders = await orderdetail.find(filter)
            .skip(skip)
            .limit(limit);

        const customerTotalData = orders.map(order => ({
            id: order.id,
            updated_at: order.updated_at,
            customer_name: order.customer.first_name,
            total: order.total_price,
            Return_status:order.status,
            Original_Payment: order.payment_gateway_names,
            Refund_Mode:order.Refund_Mode,
            Initiate_Refund: order.Initiate_Refund
        }))
        res.json(respondWithData(customerTotalData))
    } catch (err) {
        logger.info(err);
        res.json(respondInternalServerError())
    }
};