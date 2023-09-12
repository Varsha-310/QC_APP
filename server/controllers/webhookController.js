import {respondSuccess} from "../helper/response.js";
import { logger } from "../helper/utility.js";
import Queue from "better-queue";
import store from "../models/store.js";
import product from "../models/product.js";
import { getShopifyObject } from "../helper/shopify.js";
import { sendEmailViaSendGrid } from "../middleware/sendEmail.js";
import { createGiftcard, redeemWallet } from "../middleware/qwikcilver.js";
import { addGiftcardtoWallet, giftCardAmount } from "./giftcard.js";
import orders from "../models/orders.js";
import { checkActivePlanUses } from "./BillingController.js";
import qcCredentials from "../models/qcCredentials.js";
import axios from "axios";

/**
 * To handle order creation webhook
 * @param {*} req
 * @param {*} res
 */
export const orderCreated = (req, res) => {

  console.log("order created", req.headers);
  // orderCreateQueue.push({shop: req.headers["x-shopify-shop-domain"], order: req.body});
  ordercreateEvent(req,res)
  res.json(respondSuccess("webhook received"));
};

/**
 * To handle order update webhook
 * @param {*} req
 * @param {*} res
 */
export const orderUpdated = (req, res) => {
  // console.log(req.body);
  handleOrderCreatewebhook(req, res);
  res.send(respondSuccess("webhook received"));
};

/**
 * To handle order delete webhook
 * @param {*} req
 * @param {*} res
 */
export const orderDeleted = (req, res) => {
  res.json(respondSuccess("webhook received"));
};

/**
 * Handle order create event
 * @param {*} req
 * @param {*} res
 */
const ordercreateEvent = async (req,res) => {

  try {

    console.log("------------order create event-----------------");
    const order = req.body;
    const shop = req.headers["x-shopify-shop-domain"];
    const shopName = shop;
    console.log("Shop Name", shop);

    // Store Order
    await orders.updateOne({
        store_url: shop,
        id: order.id,
      },
      order,
      { upsert: true }
    );

    let settings = await store.findOne({ store_url: shopName });
    if (settings) {
      
      let newOrder = order;
      let qwikcilver_gift_cards = [];
      
      // check is any gift cards are applied in the orders
      if (newOrder.payment_gateway_names.includes("gift_card")) {
        console.log("giftcard redeemed");
        const checkAmount = await giftCardAmount(shopName, newOrder.id);
        console.log("--------redeemed amount--------------", checkAmount);
        if (checkAmount != false) {
          const redeemed = await redeemWallet(
            shopName,
            checkAmount.id,
            checkAmount.amount,
            order.current_total_price,
            order.id
          );
          console.log(redeemed.id , order.id);
          const txn_update = await orders.updateOne({id: order.id},{redeem_txn_id : redeemed.id});
          console.log(txn_update)
        }
      } else {


        let shopify = await getShopifyObject(shopName); //Get the shopify object
        console.log(
          shopify,
          "----------------shopify object----------------------"
        );

        for (let line_item of newOrder.line_items) {

          let gift_card_product = await product
            .findOne({
              id: line_item.product_id,
            })
            .lean(); //Get the product from DB

          console.log("Giftcard Products: ", gift_card_product);
          if (gift_card_product) {

            console.log("is giftcard product");
            line_item["validity"] = gift_card_product.validity;
            qwikcilver_gift_cards.push(line_item);
            //If yes, push the line item to an array
          }
        }

        // Process gift card
        if (qwikcilver_gift_cards && qwikcilver_gift_cards.length) {

          console.log("QC -Gift Catd: ", qwikcilver_gift_cards);
          // Mark order as gift card
          await orders.updateOne(
            { id: newOrder.id },
            { is_giftcard_order: true }
          );

          //  check financial status
          if( newOrder.financial_status == "paid") {

            for (let qwikcilver_gift_card of qwikcilver_gift_cards) {
              const type = "giftcard";

              const flag = await checkActivePlanUses(qwikcilver_gift_card.price, shopName);
              if(flag > 0){

                console.log("Plan Limit has been exceeded.")
                await orders.updateOne({id: newOrder.id}, {qc_gc_created: "NO"});
                await orderCancel(newOrder.id,shop);

		// done();
                return 1;
              }

              console.log("____________QC giftcard created______________", qwikcilver_gift_card );
              let email = null;
              let message = "";
              let receiver = "";
              let image_url = "";
              if (qwikcilver_gift_card.properties.length > 0) {
              
                let sent_as_gift;
                for ( let i = 0; i < qwikcilver_gift_card.properties.length; i++ ) {
                  if (qwikcilver_gift_card.properties[i].name === "_Qc_recipient_email") {
                    
                    sent_as_gift = true;
                  }
                }
                if (sent_as_gift == true) {
                  
                  console.log("-------sent as gift---------------");
                  for (let i = 0; i < qwikcilver_gift_card.properties.length; i++ ) {
                    
                    // change it to swith statement
                    if (
                      qwikcilver_gift_card.properties[i].name ===
                      "_Qc_img_url"
                    ) {
                      image_url = qwikcilver_gift_card.properties[i].value;
                    }
                    if (
                      qwikcilver_gift_card.properties[i].name ===
                      "_Qc_recipient_email"
                    ) {
                      email = qwikcilver_gift_card.properties[i].value;
                    }
                    if (
                      qwikcilver_gift_card.properties[i].name ===
                      "_Qc_recipient_message"
                    ) {
                      message = qwikcilver_gift_card.properties[i].value;
                    }

                    if (
                      qwikcilver_gift_card.properties[i].name ===
                      "_Qc_recipient_name"
                    ) {
                      receiver = qwikcilver_gift_card.properties[i].value;
                    }
                  }

                    let giftCardDetails = await createGiftcard(
                      shopName,
                      parseInt(qwikcilver_gift_card.price),
                      newOrder.id,
                      qwikcilver_gift_card.validity,
                      type,
                      newOrder.customer
                    );
                    console.log(giftCardDetails);
                    console.log(email);
                    await sendEmailViaSendGrid(
                      shopName,
                      giftCardDetails,                      
                      receiver,
                      email,
                      message,
                      image_url
                    );
                  
                }
              }
              else {

                  console.log("purchased for self");
                  let giftCardDetails = await createGiftcard(
                    shopName,
                    parseInt(qwikcilver_gift_card.price),
                    newOrder.id,
                    qwikcilver_gift_card.validity,
                    type
                  );
                  console.log(
                    giftCardDetails,
                    "--------successs-----------------"
                  );
                  const custom_id = newOrder.customer.id == 7286901178670 ? "9709857928" :  newOrder.customer.id;
                  await addGiftcardtoWallet(
                    shopName,
                    custom_id,
                    giftCardDetails.CardPin,
                    giftCardDetails.Balance,
                    type,
                    newOrder.id
                  );
              }
            }
            await orders.updateOne({id: newOrder.id}, {qc_gc_created: "YES"});
          }
        }
      }
    }
    //complete order
    // done();
  } catch (err) {

    console.log(err);
  }
};//


/**
 * Queue to handle webhooks
 */
const orderCreateQueue = new Queue(ordercreateEvent, { maxRetries: 2, retryDelay: 1000 });


//Webhooks for Product Create Activity
export const productCreateEvent = async (req, res) => {
  try {
    console.log("productCreateEvent webhook function start");
    console.log(req.body);
    //Send a response back immediately, as a delay in response will cause the webhooks to be removed
    res.status(200).send({
      success: true,
      message: "Product Create Event received successfully",
    });
    if (req.body.product_type == "qwikcilver_gift_card") {
      //Save the product to DB only if the product type is "qwikcilver_gift_card"

      let shopName = req.get("x-shopify-shop-domain");
      let settings = await store.findOne({ store_url: shopName });
      console.log(
        "------------------------settings------------------------",
        settings,
        shopName
      );
      if (settings) {
        let updatedProduct = req.body;
        updatedProduct.store = shopName;
        new processPrd(updatedProduct, shopName); //Store the product to DB
      }
    }
  } catch (err) {
    return res.json(respondInternalServerError());
}
};

/**
 * to handle order while creating and updating
 * @param {*} req
 * @param {*} res
 */
export const handleOrderCreatewebhook = async (req, res) => {
  
  try {

    const orderData = req.body;
    console.log(orderData.id);

    const store = req.headers["x-shopify-shop-domain"];
    orderData.store_url = store;

    const data = await orders.updateOne({ store_url: store, id: orderData.id }, orderData, {
      upsert: true,
    });
    console.log(data ,"Webhook Complieted");
  } catch (err) {
    logger.info(err);
    console.log(err);
    return res.json(respondInternalServerError());
  }
};

//Webhooks for Product Update Activity
export const productUpdateEvent = async (req, res) => {
  //Send a response back immediately, as a delay in response will cause the webhooks to be removed
  try {
    res.status(200).send({
      success: true,
      message: "Product Create Event received successfully",
    });
    if (req.body.product_type == "qwikcilver_gift_card") {
      //Update only if the product type is "qwikcilver_gift_card"

      let shopName = req.get("x-shopify-shop-domain");
      let settings = await store.findOne({ store_url: shopName });
      if (settings) {
        let updatedProduct = req.body;
        updatedProduct.store = shopName;
        new processPrd(updatedProduct, shopName); //Update the data in DB
      }
    }
  } catch (err) {
    console.log(err);
    return res.json(respondInternalServerError());

  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const productDeleteEvent = async (req, res, next) => {
  //Send a response back immediately, as a delay in response will cause the webhooks to be removed
  res.status(200).send({
    success: true,
    message: "Product Create Event received successfully",
  });
  try {
    //The product type check is not implemented as the Product Delete webhook will only send the product ID
    let shopName = req.get("x-shopify-shop-domain");
    let settings = await store.findOne({ store_url: shopName });
    if (settings) {
      product
        .remove({ id: req.body.id })
        .then((deleted) => console.log(`deleted product: ${req.body.id}`))
        .catch((err) => console.log(err));
    }
  } catch (error) {
    console.log(error);
    return res.json(respondInternalServerError());

  }
};

/**
 * processing product update webhook
 * @param {*} updatedProduct 
 * @param {*} store 
 */
function processPrd(updatedProduct, store) {
  
  let product_id = updatedProduct.id;
  updatedProduct.store_url = store;
  updatedProduct.id = parseInt(product_id);
  //Insert if the product details are not found, else update it
  console.log(
    updatedProduct,
    "---------------------",
    updatedProduct.store_url
  );
  product
    .findOneAndUpdate({ id: product_id }, updatedProduct, {
      upsert: true,
      setDefaultsOnInsert: true,
    })
    .then((res2) => {
      console.log("-----------processed", product_id);
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * processing merchant data from QC
 * @param {*} req 
 * @param {*} res 
 */
export const getQcCredentials = async (req,res) =>{
 console.log("--------------------webhook from QC------------------");
  logger.info("--------webhook data from QC---------------");
  logger.info("----------webhook from QC--------",req.body);
  res.send(respondSuccess("webhook received"));
  const {giftcard_cpgn , oracle_id, password , refund_cpgn, shopify_id , support_url , terminal_id, username ,wpgn} = req.body
  console.log(giftcard_cpgn , oracle_id, password , refund_cpgn, shopify_id , support_url , terminal_id, username ,wpgn)
 const log  = await qcCredentials.updateOne({shopify_id:shopify_id}, { giftcard_cpgn :giftcard_cpgn , refund_cpgn : refund_cpgn , oracle_id : oracle_id , password : password , terminal_id : terminal_id , username : username , wpgn : wpgn}, {upsert: true})
 console.log(log)
  await store.updateOne({shopify_id : shopify_id}, {dashboard_activated :true})
}

/**
 * shopify order cancel
 * @param {*} id 
 * @param {*} shop 
 */
const orderCancel = async (id , shop ) => {
  try{
const storeData = await store.findOne({store_url : shop})
let config = {
  method: 'post',
  url: `https://${shop}/admin/api/2023-07/orders/${id}/cancel.json`,
  headers: { 
    'X-Shopify-Access-Token': storeData.access_token
  }
};
const responseData = await axios(config);
console.log(responseData)

  }
  catch(err){
    console.log(err);
  }

}
