import { respondWithData, respondInternalServerError, respondSuccess } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import orderModel from "../models/orders.js";
import Store from "../models/store.js";
import axios from "../helper/axios.js";
import { ordercreateEvent } from "./webhookController.js";
import RefundSession from "../models/RefundSession.js";


const API_VERSION = process.env.API_VERSION || "2023-04";
/**
 * calculate shopify refund amount from shopify
 * 
 * @param {*} orderId 
 * @param {*} data 
 * @param {*} storeUrl 
 * @param {*} accessToken 
 * @returns 
 */
const fetchOurders = async(accessToken, url) => {

    const options = {
        'method': 'GET',
        'url':url,
        'headers': {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
        }
    };
    return axios(options);
}

/**
 * Sync method to fetch all orders details from the shopify for an speciific store
 *  
 * Dev: Birendra Kr, Date: Feb-20, 2023.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const processSyncOrders = async (req) => {

  try {

    console.log("Process Started");
    const store = req.token.store_url;
    const lastOrder = await orderModel.findOne({ store_url: store })
      .sort({ created_at: 1 })
      .limit(1);

console.log("_____________last order_____________",lastOrder)
    const storeObj = await Store.findOne({ store_url: store });
    console.log(storeObj);
    if (!storeObj) {

      console.log("Store Not Found");
      return;
    }

    let sinceId = lastOrder ? lastOrder.id : "0"; 
console.log("_____________sinceid_____________", sinceId )
    const countUrl = `https://${storeObj.store_url}/admin/api/${API_VERSION}/orders/count.json?since_id=${sinceId}`;
    const ordersCount = await fetchOurders(storeObj.access_token, countUrl);

    if(ordersCount.status != 200){

        console.log(ordersCount);
        return res.json(reportError("Unable to fetch order data"));
    }
    console.log("order count", ordersCount.data.count);
    const iteration = Math.ceil(ordersCount.data.count / 50);
    console.log("iteration ", iteration);
    for (let i = 1; i <= iteration; i++) {

      console.log("Sync Id", sinceId);
      const orderUrl = `https://${storeObj.store_url}/admin/api/${API_VERSION}/orders.json?since_id=${sinceId}`
      const allOrders = await fetchOurders(storeObj.access_token, orderUrl);
      if(allOrders.status != 200){
        
        console.log(allOrders);
        continue;
      }
      allOrders.data.orders.forEach(async (item) => {

        item["store_url"] = store;
        // await orderModel.updateOne({ id: item.id }, item, { upsert: true }).catch((error) => {

        //     console.log("Error Encountered While storeing the order in sync:", item.id);
        //     console.log(error);
        // });
        await ordercreateEvent(store,item,res);
        sinceId = item.id;
      });
      await sleep(2000);
    }
    console.log("Process Completed");
  } catch (error) {

    console.log("error encountered while syncing the orders", error);
  }
}

export const handleSyncOrder = (req, res) => {

    console.log(req.token);
  processSyncOrders(req);
  return res.status(200).json(respondSuccess("Order Sync Process Started"));
}



/**
 * Function to handle pagination and filter the data according to store url.
 * 
 * @param {*} req
 * @param {*} res
 */

export const handleOrderDataList = async (req, res) => {

  try {       
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 20;
      let skip = (page - 1) * limit;
      const storeUrl = req.token.store_url;
      const storeUrlFilter = { store_url: storeUrl };
    
      // Fetch all the data present in the particular store 

      const filter = { ...storeUrlFilter }
     filter.is_giftcard_order = false

      if (req.query.Refund_Mode) {
          filter.Refund_Mode = req.query.Refund_Mode;
      }
      if (req.query.payment_gateway_names) {
          filter.payment_gateway_names = req.query.payment_gateway_names;
      };
      if(req.query.orderNo){
        filter.order_number = req.query.orderNo
      }
      if(req.query.startDate && req.query.endDate){
        filter.created_at ={
          $gte :new Date(req.query.startDate),
          $lte:new Date(req.query.endDate)
        }
        
      }
      console.log(filter, "filter added");
        const orders = await orderModel.find(
          filter,
          { id:1, updated_at:1, 'customer.first_name':1,
            total_price:1,status:1,payment_gateway_names:1,
            Refund_Mode:1,refund_status:1,
            financial_status: 1, fulfillment_status:1,
            refund_status: 1, order_number: 1
          })
          .sort({ created_at:-1 })
          .skip(skip)
          .limit(limit);
      const totalCount = await orderModel.countDocuments(filter); 
      return res.json(respondWithData("Success",{orders, totalOrders: totalCount}))
  } catch (err) {

      logger.info(err);
      console.log(err);
     return res.json(respondInternalServerError())
  }
};

/**
 * Function to handle pagination and filter the data according to store url.
 * 
 * @param {*} req
 * @param {*} res
 */

export const handleOrderDetails = async (req, res) => {

  try {
     
      const { orderId, refund } = req.body;
      const {store_url } = req.token;
      const result = {};
      result["orders"] = await orderModel.findOne({
        store_url,
        id : orderId
      });

      if (refund) {
        
        result["refund"] = await RefundSession.findOne({
            order_id: orderId, store_url: store_url
        }, {_id:0, __v: 0, "logs._id": 0, "logs.storeCredit":0});
      }
      return res.json(respondWithData("Success",result))
  } catch (err) {

      logger.info(err);
      console.log(err);
      return res.json(respondInternalServerError())
  }
};
