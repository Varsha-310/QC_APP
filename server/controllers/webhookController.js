import { respondSuccess } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import Queue from "better-queue";
import store from "../models/store.js";
import product from "../models/product.js";
import { sendEmailViaSendGrid } from "../middleware/sendEmail.js";
import {
  createGiftcard,
  redeemWallet,
  reverseRedeemWallet,
} from "../middleware/qwikcilver.js";
import { addGiftcardtoWallet, giftCardAmount } from "./giftcard.js";
import orders from "../models/orders.js";
import { checkActivePlanUses } from "./BillingController.js";
import OrderCreateEventLog from "../models/OrderCreateEventLog.js";
import qcCredentials from "../models/qcCredentials.js";
import cron from "node-cron";
import axios from "axios";
import { updateShopifyGiftcard } from "./giftcard.js";
import wallet from "../models/wallet.js";

/**
 * To handle order creation webhook
 * @param {*} req
 * @param {*} res
 */
export const orderCreated = (req, res) => {
  console.log("order created", req.headers);
  // orderCreateQueue.push({shop: req.headers["x-shopify-shop-domain"], order: req.body});
  const shop = req.headers["x-shopify-shop-domain"];
  const order = req.body;
  ordercreateEvent(shop, order, res);
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
export const ordercreateEvent = async (shop, order, res) => {
  try {
    console.log("Shop Name", shop, order.id);
    const logQuery = {
      store: shop,
      orderId: order.id,
    };

    console.log("------------order create event-----------------");
    console.log("Shop Name", shop, order.id);

    // Store Order
    const orderSaved = await orders.updateOne(
      {
        store_url: shop,
        id: order.id,
      },
      order,
      { upsert: true }
    );
    //console.log(orderSaved);
    let gift_card_product;
    let settings = await store.findOne({ store_url: shop });
    if (settings) {
      let newOrder = order;
      let qwikcilver_gift_cards = [];

      // check is any gift cards are applied in the orders
      for (let line_item of newOrder.line_items) {
        //console.log(line_item.product_id);
        gift_card_product = await product
          .findOne({
            id: line_item.product_id,
          })
          .lean(); //Get the product from DB

       // console.log("Giftcard Products: ", gift_card_product);
        if (gift_card_product) {
          console.log("is giftcard product");
          line_item["validity"] = gift_card_product.validity;
          qwikcilver_gift_cards.push(line_item);
        }
      }

      // await OrderCreateEventLog.updateOne({store: shop},{orderId: order.id}, {upsert: true})
      let OrderSession = await OrderCreateEventLog.findOne({
        store: shop,
        orderId: order.id,
      });
     // console.log(OrderSession, "ordersession");
      if (OrderSession?.status == "done") {
        // done(null, true);
        return; // skip if already processed.
      }
      OrderSession = OrderSession ? OrderSession : logQuery;
      const numberOfRetried = OrderSession?.numberOfRetried
        ? parseInt(OrderSession?.numberOfRetried) + 1
        : 1;
      // console.log(OrderSession, "ordersession");

      //check gc in the order & process
      if (qwikcilver_gift_cards && qwikcilver_gift_cards.length) {
        if (newOrder.payment_gateway_names.includes("gift_card")) {
          await orders.updateOne(
            { id: newOrder.id },
            {
              is_giftcard_order: true,
              remarks: "Gift Card Is used for buy the Gift Card",
            },
            { upsert: true }
          );
          const walletExists = await wallet.findOne({
            shopify_customer_id: newOrder.customer.id,
          });
          if (walletExists) {
            let checkAmount = await giftCardAmount(shop, newOrder.id);
            await orderCancel(newOrder.id, shop);
            await updateShopifyGiftcard(
              shop,
              settings.access_token,
              walletExists.shopify_giftcard_id,
              checkAmount.amount
            );
          }
          return 1;
        }

        console.log("QC -Gift Catd: ", qwikcilver_gift_cards);
        // Mark order as gift card
        await orders.updateOne(
          { id: newOrder.id },
          { is_giftcard_order: true }
        );
        await OrderCreateEventLog.updateOne(
          logQuery,
          { action: "gift", numberOfRetried, ...logQuery },
          { upsert: true }
        );

        //  check financial status
        if (newOrder.financial_status == "paid") {
          for (let qwikcilver_gift_card of qwikcilver_gift_cards) {
            const type = "giftcard";
            const flag = await checkActivePlanUses(
              qwikcilver_gift_card.price,
              shop
            );
            if (flag > 0) {
              console.log("Plan Limit has been exceeded.");
              await orders.updateOne(
                { id: newOrder.id },
                { qc_gc_created: "NO" }
              );
              await orderCancel(newOrder.id, shop);

              // done();
              return 1;
            }
            // console.log(
            //   "____________QC giftcard created______________",
            //   qwikcilver_gift_card
            // );
            let email = null;
            let message = "";
            let receiver = "";
            let image_url = "";
            if (qwikcilver_gift_card.properties.length > 0) {
              let sent_as_gift;
              for (let i = 0; i < qwikcilver_gift_card.properties.length; i++) {
                if (
                  qwikcilver_gift_card.properties[i].name ===
                  "_Qc_recipient_email"
                ) {
                  sent_as_gift = true;
                }
              }
              if (sent_as_gift == true) {
                console.log("-------sent as gift---------------");
                for (
                  let i = 0;
                  i < qwikcilver_gift_card.properties.length;
                  i++
                ) {
                  // change it to swith statement
                  if (
                    qwikcilver_gift_card.properties[i].name === "_Qc_img_url"
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

                let giftCardDetails = {};
                if (OrderSession?.other?.createGC?.status == true) {
                  giftCardDetails =
                    OrderSession?.other?.createGC?.resp.Cards[0];
                } else {
                  const logs = await createGiftcard(
                    shop,
                    parseFloat(qwikcilver_gift_card.price),
                    newOrder.id,
                    qwikcilver_gift_card.validity,
                    type,
                    newOrder.customer,
                    OrderSession?.gift?.createGC
                  );
                  // OrderSession["other"]["createGC"] = logs;
                  await OrderCreateEventLog.updateOne(
                    logQuery,
                    { "gift.createGC": logs },
                    { upsert: true }
                  );
                  if (!logs.status) throw new Error("Error: Create Gift Card");
                  giftCardDetails = logs.resp.Cards[0];
                }
                console.log(giftCardDetails);

                if (!OrderSession?.other?.sentEmailAt) {
                  await sendEmailViaSendGrid(
                    shop,
                    giftCardDetails,
                    receiver,
                    email,
                    message,
                    image_url,
                    gift_card_product.title
                  );
                  // OrderSession["other"]["sentEmailAt"] = new Date().toISOString();
                  await OrderCreateEventLog.updateOne(
                    logQuery,
                    { "gift.sentEmailAt": new Date().toISOString() },
                    { upsert: true }
                  );
                }
              }
            } else {
              console.log("purchased for self");
              await OrderCreateEventLog.updateOne(
                { orderId: order.id },
                { action: "self" }
              );

              let giftCardDetails = {};
              if (OrderSession?.self?.createGC?.status == true) {
                giftCardDetails = OrderSession?.self?.createGC?.resp.Cards[0];
              } else {
                const logs = await createGiftcard(
                  shop,
                  parseInt(qwikcilver_gift_card.price),
                  newOrder.id,
                  qwikcilver_gift_card.validity,
                  type,
                  newOrder.customer,
                  OrderSession?.self?.createGC
                );
                // OrderSession["self"]["createGC"] = logs;
                await OrderCreateEventLog.updateOne(
                  logQuery,
                  { "self.createGC": logs },
                  { upsert: true }
                );
                if (!logs.status) throw new Error("Error: Create Gift Card");
                giftCardDetails = logs.resp.Cards[0];
              }
              console.log(giftCardDetails, "--------successs-----------------");
              if (OrderSession?.self?.wallet?.status != true) {
                const logs = await addGiftcardtoWallet(
                  shop,
                  newOrder.customer.id,
                  giftCardDetails.CardPin,
                  giftCardDetails.Balance,
                  type,
                  newOrder.id,
                  OrderSession?.self?.wallet
                );
                // OrderSession["self"]["wallet"] = logs;
                //console.log(logs, "logs of wallet");
                await OrderCreateEventLog.updateOne(
                  { store: shop, orderId: order.id },
                  { "self.wallet": logs }
                );
                if (!logs.status)
                  throw new Error("Error: Add Gift Card To Wallet");
              }
            }
          }
          await orders.updateOne({ id: newOrder.id }, { qc_gc_created: "YES" });
        }
      } else if (newOrder.payment_gateway_names.includes("gift_card")) {
        
        console.log("giftcard redeemed");
        let checkAmount = await giftCardAmount(shop, newOrder.id);
        console.log("--------redeemed amount--------------", checkAmount);

        if (checkAmount != false) {
          if (OrderSession?.redeem?.status != true) {
            const redeemed = await redeemWallet(
              shop,
              checkAmount.id,
              checkAmount.amount,
              order.current_total_price,
              order.id,
              OrderSession?.redeem
            );
            // OrderSession["redeem"] = redeemed;
            await OrderCreateEventLog.updateOne(
              logQuery,
              { redeem: redeemed, numberOfRetried },
              { upsert: true }
            );
            // if(redeemed["status"] == "NonZero"){
              
            //   console.log("Cancelling the API on validation error from QC");
            //   await orderCancel(order.id, shop);
            // }
            if (!redeemed.status) throw new Error("Error: Redeem Gift Card");
          }
        }
      }
    }
    await OrderCreateEventLog.updateOne(logQuery, { status: "done" }).then(
      (resp) => console.log("Final Updates:", resp)
    );
    // done(null, true);
  } catch (err) {
    console.log(err);
    // done(null, false);
  }
};

/**
 * Queue to handle webhooks
 */
const orderCreateQueue = new Queue(ordercreateEvent, {
  maxRetries: 1,
  retryDelay: 10000,
  batchSize: 1,
});

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
    const data = await orders.updateOne(
      { store_url: store, id: orderData.id },
      orderData,
      {
        upsert: true,
      }
    );
    console.log(data, "Webhook Complieted");
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
export const getQcCredentials = async (req, res) => {

  console.log("--------------------webhook from QC------------------");
  logger.info("--------webhook data from QC---------------");
  logger.info("----------webhook from QC--------", req.body);
  res.send(respondSuccess("webhook received"));
  const {
    giftcard_cpgn,
    oracle_id,
    password,
    refund_cpgn,
    shopify_id,
    support_url,
    terminal_id,
    username,
    wpgn,
  } = req.body;
  const log = await qcCredentials.updateOne(
    { shopify_id: shopify_id },
    {
      giftcard_cpgn: giftcard_cpgn,
      refund_cpgn: refund_cpgn,
      oracle_id: oracle_id,
      password: password,
      terminal_id: terminal_id,
      username: username,
      wpgn: wpgn,
    },
    { upsert: true }
  );
  console.log(log);
  await store.updateOne(
    { shopify_id: shopify_id },
    { dashboard_activated: true }
  );
};

/**
 * Shedule Cron for Retry the Failed Error
 */
export const failedOrders = async () => {

  console.log(" --- Retry Process Started ---- ");
  const failedOrders = await OrderCreateEventLog.find({
    status: "retry",
    numberOfRetried: { $lte: 3}
  });
  console.log("Total Failed Orders: ", failedOrders.length);
  for (const iterator of failedOrders) {

    console.log(`No Of Retries: ${iterator.numberOfRetried} --- Order Id: ${iterator.orderId}`);
    if (iterator.numberOfRetried >= 3) {
     
      console.log("order retry greater than three");
      if (iterator.action == "redeem") {

        console.log("Redeem Action");
        await reverseRedeemWallet(
          iterator.store,
          iterator.orderId,
          iterator.redeem.req.billAmount,
          iterator.redeem.req.Cards[0].CardNumber,
          iterator.redeem.req.Cards[0].Amount
        );
        await orderCancel(iterator.orderId, iterator.store);
      }
      await OrderCreateEventLog.findOneAndUpdate(
        { orderId: iterator.orderId },
        { status: "done", numberOfRetried: parseInt(iterator.numberOfRetried) + 1 }
      );
    } else {

      const currentTime = Date.now();
      const timeDifference = Math.floor(Math.abs((iterator?.retriedAt || iterator.updatedAt - currentTime) / 1000));
      const diff = iterator.numberOfRetried == 1 ? 60 : 120;
      console.log(`Current Time: ${currentTime}, Last Retied: ${iterator?.retriedAt || iterator.updatedAt}`);
      console.log(`Time Diffrence: ${timeDifference} -  Diff: ${diff}`);

      if (timeDifference > diff) {

        const orderData = await orders.findOne({
          id: iterator.orderId,
          store_url: iterator.store,
        });
        await ordercreateEvent(orderData.store_url, orderData);
      }
    }
  }
};

/**
 * processing failed order session
 * @param {*} threshold
 */
async function processOrder(iterator, threshold, max) {

  try {
 
    console.log(iterator, "iterator");
    console.log(timeDifference, threshold, max, "time");
    if (max > timeDifference < threshold) {

      console.log(timeDifference, threshold, "available for retry");
    }
  } catch (err) {
    console.log("error in processing", err);
  }
}

/**
 * shopify order cancel
 * @param {*} id
 * @param {*} shop
 */
const orderCancel = async (id, shop) => {
  try {
    const storeData = await store.findOne({ store_url: shop });
    let config = {
      method: "post",
      url: `https://${shop}/admin/api/2023-07/orders/${id}/cancel.json`,
      headers: {
        "X-Shopify-Access-Token": storeData.access_token,
      },
    };
    const responseData = await axios(config);
    console.log(responseData);
  } catch (err) {
    console.log(err);
  }
};
