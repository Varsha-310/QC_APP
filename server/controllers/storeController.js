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
        const orders = await orderdetail.find(filter,{id:1,updated_at:1,'customer.first_name':1,total_price:1,status:1,payment_gateway_names:1,Refund_Mode:1,Initiate_Refund:1})
            .skip(skip)
            .limit(limit);
        const totalCount = await orderdetail.countDocuments(filter); 
        res.json(respondWithData({msg:"Success",code:200,data: orders, totalOrders: totalCount}))
    } catch (err) {
        logger.info(err);
        console.log(err);
        res.json(respondInternalServerError())
    }
};