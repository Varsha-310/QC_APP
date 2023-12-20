import { respondInternalServerError } from "../helper/response";
import { logger } from "../helper/utility";
import axios from "axios"
import orders from "../models/orders";
import stores from "../models/store";

/**
 * To ckeck giftcard refund amount
 * @param {*} req
 * @param {*} res
 */

// Function to check the refundamount by giftcard
export const checkGiftCardAmount = async (req, res) => {
  try {
   const TotalAmount = await giftCardAmount(req, res);
    console.log("Total gift card amount", TotalAmount);
    res.json("total amount",{ TotalAmount }, 200);

  }
  catch (err) {
    console.log(err);
    // logger.info(err);
    res.json(
      respondInternalServerError()
    );
  }
};


/**
 * checking amount paid by gitcard.
 * @param {*} req
 * @param {*} res
 */
export const giftCardAmount = async (req, res) => {
  try {
    const { id } = req.body;
    
    const storeData = await orders.find({id });  
    const store_url = req.headers['x-shopify-shop-domain'];

    const store = await stores.find({ store_url: store_url });
    const accessToken = store[0].access_token;

    const options = {
      'method': 'GET',
      'url': `https://${store_url}/admin/api/2023-04/orders/${id}/transactions.json`,
      'headers': {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
    };
    const result = await axios(options);
    const transactionData = result.data.transactions[0].amount;
    return transactionData;

  } catch (err) {
    console.log(err);
  }
}
