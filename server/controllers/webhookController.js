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
  cancelActivateGiftcard,
  checkWalletOnQC,
  cancelAddCardToWallet,
  createWallet,
  reverseCreateGiftcard
} from "../middleware/qwikcilver.js";
import { addGiftcardtoWallet, giftCardAmount } from "./giftcard.js";
import orders from "../models/orders.js";
import { checkActivePlanUses, updateBilling } from "./BillingController.js";
import OrderCreateEventLog from "../models/OrderCreateEventLog.js";
import qcCredentials from "../models/qcCredentials.js";
import axios from "../helper/axios.js";
import Wallet from "../models/wallet.js";


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
  ordercreateEvent(shop, order);
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
 * calculate shopify refund amount from shopify
 *
 * @param {*} orderId
 * @param {*} storeUrl
 * @param {*} accessToken
 * @returns
 */
export const getOrderTransactionDetails = async (
  orderId,
  storeUrl,
  accessToken
) => {
  const options = {
    method: "GET",
    url: `https://${storeUrl}/admin/api/2023-04/orders/${orderId}/transactions.json`,
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  };
  return axios(options);
};

/**
 * Handle order create event
 * @param {*} req
 * @param {*} res
 */
export const ordercreateEvent = async (shop, order) => {
  try {
    console.log("Shop Name", shop, order.id);
    const logQuery = {
      store: shop,
      orderId: order.id,
    };

    console.log("------------order create event-----------------");
    console.log("Shop Name", shop, order.id);

    // Store Order
    await orders.updateOne(
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
    console.log(settings);
    let gc_order = ({ amount : undefined, sent_as_gift : false });
    if (settings) {
      let newOrder = order;
      let qwikcilver_gift_cards = [];

      // check is any gift cards are applied in the orders
      for (let line_item of newOrder.line_items) {
        console.log(line_item.product_id);
        gift_card_product = await product
          .findOne({
            id: line_item.product_id,
          })
          .lean(); //Get the product from DB

        console.log("Giftcard Products: ", gift_card_product);
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
        console.log("Already Processed");
        return 1; // skip if already processed.
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
          await orderCancel(
            newOrder,
            shop,
            "Gift Card Is used for buy the Gift Card"
          );
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
              await orderCancel(
                newOrder,
                shop,
                "Plan Limit has been exceeded."
              );
              return 1;
            }
            let email = null;
            let message = "";
            let receiver = "";
            let image_url = "";

            qwikcilver_gift_card.properties.forEach((property) => {
              console.log(property.name)
              if (property.name === "_Qc_recipient_email") {
                (gc_order.sent_as_gift = true),
                  (gc_order.amount = parseFloat(qwikcilver_gift_card.price));
              } 
            });
            console.log(gc_order , "--------------gcorder details ----------");
            if (gc_order.sent_as_gift == true) {
              console.log("-------sent as gift---------------");
              for (let i = 0; i < qwikcilver_gift_card.properties.length; i++) {
                // change it to swith statement
                if (qwikcilver_gift_card.properties[i].name === "_Qc_img_url") {
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
              console.log(OrderSession?.gift?.createGC, "createGc status");
              if (OrderSession?.gift?.createGC?.status == true) {
                giftCardDetails = OrderSession?.gift?.createGC?.resp.Cards[0];
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
                const mailResponse = await sendEmailViaSendGrid(
                  shop,
                  giftCardDetails,
                  receiver,
                  email,
                  message,
                  image_url,
                  gift_card_product.title
                );
                // OrderSession["other"]["sentEmailAt"] = new Date().toISOString();
                let mailSentAt;
                if (mailResponse == true) {
                  mailSentAt = new Date().toISOString();
                } else {
                  mailSentAt = null;
                }
                await OrderCreateEventLog.updateOne(
                  logQuery,
                  { "gift.sentEmailAt": mailSentAt },
                  { upsert: true }
                );
              }
            } else {
              console.log("purchased for self");
              await OrderCreateEventLog.updateOne(
                { orderId: order.id },
                { action: "self" }
              );

              let giftCardDetails = {};
              if (OrderSession?.self?.checkwallet?.status == 200) {
                walletNumber =
                  OrderSession.self.checkWallet.resp.Wallets[0]["WalletNumber"];
              } else {
                let checkWallet = OrderSession.self?.checkWallet || {
                  status: 0,
                };
                if ([0, 1].includes(checkWallet?.status)) {
                  checkWallet = await checkWalletOnQC(
                    shop,
                    newOrder.customer.id,
                    OrderSession.self?.checkWallet
                  );
                  console.log(" checking wallet on qc", checkWallet);
                  // OrderSession.self["checkWallet"] = checkWallet;
                  await OrderCreateEventLog.updateOne(
                    logQuery,
                    { "self.checkWallet": checkWallet },
                    { upsert: true }
                  );
                  await Wallet.updateOne(
                    {
                      store_url: shop,
                      shopify_customer_id: newOrder.customer.id,
                    },
                    {
                      wallet_id: checkWallet.resp.Wallets[0]["WalletNumber"],
                      WalletPin: checkWallet.resp.Wallets[0]["WalletPin"],
                    },
                    { upsert: true }
                  );
                  if (checkWallet.status === 1)
                    throw Error("Error: Check Wallet");
                }
                if (checkWallet.status == 404) {
                  const createWalletOnQc = await createWallet(
                    shop,
                    newOrder.customer.id,
                    newOrder.id,
                    OrderSession.self?.createWallet
                  );
                  console.log(JSON.stringify(createWalletOnQc));
                  // OrderSession.self["createWallet"] = createWalletOnQc;
                  await OrderCreateEventLog.updateOne(
                    logQuery,
                    { "self.checkWallet": createWalletOnQc },
                    { upsert: true }
                  );
                  if (!createWalletOnQc.status)
                    throw Error("Error: Creating Wallet On WC");
                  await Wallet.updateOne(
                    {
                      store_url: shop,
                      shopify_customer_id: newOrder.customer.id,
                    },
                    {
                      wallet_id:
                        createWalletOnQc["resp"].Wallets[0]["WalletNumber"],
                      WalletPin:
                        createWalletOnQc["resp"].Wallets[0]["WalletPin"],
                    },
                    { upsert: true }
                  );
                  console.log(OrderSession)
                  // OrderSession.self["checkWallet"]["status"] = true;
                }
              }
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
                  giftCardDetails.ExpiryDate,
		  OrderSession?.self?.wallet,
                 
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
        let checkAmount = await giftCardAmount(
          shop,
          newOrder.id,
          newOrder.customer.id
        );
        console.log("--------redeemed amount--------------", checkAmount);
        // Cancle request when wallet not found
        if (!checkAmount.error) {
          if (OrderSession?.redeem?.status != true) {
            const redeemed = await redeemWallet(
              shop,
              checkAmount.id,
              checkAmount.amount,
              order.current_total_price,
              order.id,
              OrderSession?.redeem
            );
            await OrderCreateEventLog.updateOne(
              logQuery,
              { redeem: redeemed, numberOfRetried },
              { upsert: true }
            ).then((resp) => console.log("Log updated:", resp));
            if (
              ["config", false, "insufficient"].includes(redeemed["status"])
            ) {
              console.log("Cancelling the API on validation error from QC");
              await orderCancel(order, shop, redeemed["error"]);
            }
            if (redeemed.status == "timeout")
              throw new Error("Error: Redeem Gift Card");
          }
        } else {
          console.log("Wallet not found", checkAmount);
          await orderCancel(order, shop, "Missmatch: User Account & Wallet");
          await OrderCreateEventLog.updateOne(
            logQuery,
            { redeem: checkAmount, numberOfRetried },
            { upsert: true }
          );
        }
      }
    }
    await OrderCreateEventLog.updateOne(logQuery, { status: "done" }).then(
      (resp) => console.log("Final Updates:", resp)
    );
    if (gc_order.sent_as_gift == true) {
      await updateBilling(gc_order.amount, shop);
      await OrderCreateEventLog.updateOne({
        logQuery,
        updateBillingAt: new Date().toISOString(),
      });
    }
    if (gc_order.sent_as_gift == false) {
      
        await updateBilling(gc_order.amount, shop);
        logs["updateBillingAt"] = new Date().toISOString();
      
    }
    return 1;
    // done(null, true);
  } catch (err) {
    console.log(err);
    return 0;
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
    numberOfRetried: { $lte: 4 },
  });
  console.log("Total Failed Orders: ", failedOrders.length);
  for (const iterator of failedOrders) {
    console.log(
      `No Of Retries: ${iterator.numberOfRetried} --- Order Id: ${iterator.orderId}`
    );
    if (iterator.numberOfRetried > 2) {
      const orderData = await orders.findOne({ id: iterator.orderId });

      console.log("order retry greater than three");
      let reverse = {};
      if (iterator.action == "redeem") {
        console.log("Redeem Action");
        reverse = await reverseRedeemWallet(
          iterator.store,
          iterator.orderId,
          iterator.redeem.req.billAmount,
          iterator.redeem.req.Cards[0].CardNumber,
          iterator.redeem.req.Cards[0].Amount,
          iterator.redeem.resp.TransactionId
        );
      }
      if (iterator.action == "gift") {
        console.log("reverse giftcard")
        reverse = await reverseCreateGiftcard(
          iterator.store,
          iterator.gift.createGC.req,
          iterator.gift.createGC.resp.TransactionId
        );
      }
      if (iterator.action == "self") {
        if (
          iterator.self.createGC.status == false) {
            reverse = await reverseCreateGiftcard(
            iterator.store,
            iterator.self.createGC.req,
            iterator.self.createGC.resp.TransactionId
          );
        } else {
          reverse = await cancelActivateGiftcard(
            iterator.store,
            iterator.self.createGC.resp.Cards[0].CardNumber,
            iterator.self.createGC.req.Cards[0].Amount,
            iterator.self.createGC.resp.CurrentBatchNumber,
            iterator.self.createGC.resp.TransactionId,
            iterator.self.createGC.resp.Cards[0].ApprovalCode
          );
         
        }
      }

      await orderCancel(
        orderData,
        iterator.store,
        "Unable to Redeem On QC after all Reties."
      );
      await OrderCreateEventLog.findOneAndUpdate(
        { orderId: iterator.orderId },
        {
          status: "done",
          reverse,
          numberOfRetried: parseInt(iterator.numberOfRetried) + 1,
        }
      );
    } else {
      console.log("eligilble for retry");
      const currentTime = Date.now();
      const timeDifference = Math.floor(
        Math.abs(
          (iterator?.retriedAt || iterator.updatedAt - currentTime) / 1000
        )
      );
      const diff = iterator.numberOfRetried == 1 ? 60 : 120;
      console.log(
        `Current Time: ${currentTime}, Last Retied: ${
          iterator?.retriedAt || iterator.updatedAt
        }`
      );
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
 * shopify order cancel
 * @param {*} id
 * @param {*} shop
 */
export const orderCancel = async (orderData, shop, note = "") => {
  try {
    const id = orderData.id;
    const storeData = await store.findOne({ store_url: shop });
    let transactions = await getOrderTransactionDetails(
      id,
      shop,
      storeData.access_token
    );
    transactions = transactions.data.transactions.map((trans) => {
      return {
        parent_id: trans.id,
        amount: trans.amount,
        kind: "refund",
        gateway: trans.gateway,
      };
    });
    const line_item = orderData.line_items.map((items) => {
      let item = {
        line_item_id: items.id,
        quantity: items.quantity,
      };
      if (items.location_id) {
        item = {
          ...item,
          restock_type: "cancel",
          location_id: 24826418,
        };
      } else {
        item = {
          ...item,
          restock_type: "no_restock",
        };
      }
      return item;
    });

    const data = {
      refund: {
        note: note,
        shipping: { full_refund: true },
        refund_line_items: line_item,
        transactions: transactions,
      },
    };
    let config = {
      method: "post",
      url: `https://${shop}/admin/api/2023-07/orders/${id}/cancel.json`,
      headers: {
        "X-Shopify-Access-Token": storeData.access_token,
      },
      data: data,
    };
    console.log(JSON.stringify(config));
    const responseData = await axios(config);
    console.log(responseData);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
