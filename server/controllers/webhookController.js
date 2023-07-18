import { respondSuccess, respondInternalServerError } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import Queue from "better-queue";
import store from "../models/store.js";
import product from "../models/product.js";
import { getShopifyObject } from "../helper/shopify.js";
import { sendEmailViaSendGrid } from "../middleware/sendEmail.js";
import {
  createGiftcard,
  redeemWallet,
} from "../middleware/qwikcilverHelper.js";
import { addGiftcardtoWallet, giftCardAmount } from "./giftcard.js";
import orders from "../models/orders.js";

/**
 * To handle order creation webhook
 * @param {*} req
 * @param {*} res
 */

export const orderCreated = (req, res) => {
  console.log("order created", req.headers);
  // const shop = req.headers.x-shopify-shop-domain;
  const shop = "mmtteststore*.myshopify.com";
  const order = req.body;
  ordercreateEvent({ shop, order });
  res.json(respondSuccess("webhook received"));
};

/**
 * To handle order update webhook
 * @param {*} req
 * @param {*} res
 */

export const orderUpdated = (req, res) => {
  // console.log(req.body);
  handleOrderCreatewebhook(req, res)
  res.send(respondSuccess("webhook received"));
};

/**
 * To handle order delete webhook
 * @param {*} req
 * @param {*} res
 */
export const orderDeleted = (req, res) => {
  // res.json(respondSuccess("webhook received"));
};

/**
 * Handle order create event
 * @param {*} req
 * @param {*} res
 */
const ordercreateEvent = async (input, done) => {
  try {
    console.log("------------order create event-----------------");
    const { shop, order } = input;

    let isGiftcardOrder = false;
    let shopName = "mmtteststore8.myshopify.com";
    console.log("Shop Name", shop);
    let settings = await store.findOne({ store_url: shopName });
    if (settings) {
      let newOrder = order;
      let qwikcilver_gift_cards = [];
      if (newOrder.payment_gateway_names.includes("gift_card")) {
        console.log("giftcard redeemed");
        const checkAmount = await giftCardAmount(store, id);
        if (checkAmount != false) {
          const redeemed = await redeemWallet(
            store,
            checkAmount.id,
            checkAmount.amount
          );

          console.log(redeemed);
        }
      } else {
        let shopify = await getShopifyObject(shopName); //Get the shopify object
        console.log(
          shopify,
          "----------------shopify object----------------------"
        );
        for (let line_item of newOrder.line_items) {
          //Check for the order lineitems whether it contains a QC Giftcard Product
          // gift_card_product = "";
          console.log(line_item);
          let gift_card_product = await product
            .findOne({
              id: line_item.product_id,
            })
            .lean(); //Get the product from DB
          if (gift_card_product) {
            //Check the product type
            isGiftcardOrder = true;
            let cpg_name = "12345";
            const storeOrder = await orders.create(order);
            console.log("-------order created-----------", storeOrder);
            qwikcilver_gift_cards.push(line_item);
            //If yes, push the line item to an array
          }
          if (qwikcilver_gift_cards && qwikcilver_gift_cards.length) {
            if (
              newOrder.financial_status == "paid" ||
              shopName === "qwikcilver-demo.myshopify.com"
            ) {
              for (let qwikcilver_gift_card of qwikcilver_gift_cards) {
                console.log(
                  "____________QC giftcard created___________________"
                );
                var email = null;
                var message = "";
                var sender = "";
                var receiver = "";
                if (qwikcilver_gift_card.properties) {
                  let sent_as_gift = false;
                  for (
                    let i = 0;
                    i < qwikcilver_gift_card.properties.length;
                    i++
                  ) {
                    if (
                      qwikcilver_gift_card.properties[i].name ===
                      "Gift to Email"
                    ) {
                      sent_as_gift = true;
                      let updateOrder = await orders.findOneAndUpdate(
                        { id: newOrder.id },
                        { is_giftcard_order: true }
                      );
                      console.log(
                        "--------send as a gift--------------",
                        updateOrder
                      );
                    }
                  }
                  if (sent_as_gift == true) {
                    for (
                      let i = 0;
                      i < qwikcilver_gift_card.properties.length;
                      i++
                    ) {
                      if (
                        qwikcilver_gift_card.properties[i].name ===
                        "Gift to Email"
                      ) {
                        email = qwikcilver_gift_card.properties[i].value;
                      }
                      if (
                        qwikcilver_gift_card.properties[i].name ===
                        "_Gift to Email"
                      ) {
                        email = qwikcilver_gift_card.properties[i].value;
                      }
                      if (
                        qwikcilver_gift_card.properties[i].name ===
                        "_QC Message"
                      ) {
                        message = qwikcilver_gift_card.properties[i].value;
                      }
                      if (
                        qwikcilver_gift_card.properties[i].name ===
                        "_sender_name"
                      ) {
                        sender = qwikcilver_gift_card.properties[i].value;
                      }
                      if (
                        qwikcilver_gift_card.properties[i].name ===
                        "_recipient_name"
                      ) {
                        receiver = qwikcilver_gift_card.properties[i].value;
                      }

                      let giftCardDetails = await createGiftcard(
                        shopName,
                        parseInt(qwikcilver_gift_card.price),
                        newOrder.id,
                        gift_card_product.expiry_date
                      );
                      console.log(email);
                      await sendEmailViaSendGrid(
                        giftCardDetails.createGiftCardResponse,
                        newOrder,
                        shopName,
                        email,
                        message,
                        sender,
                        receiver
                      );
                    }
                  } else {
                    let giftCardDetails = await createGiftcard(
                      shopName,
                      parseInt(qwikcilver_gift_card.price),
                      newOrder.id,
                      gift_card_product.expiry_date
                    );
                    console.log(
                      giftCardDetails,
                      "--------successs-----------------"
                    );
                    const addCard = await addGiftcardtoWallet(
                      shopName,
                      newOrder.customer.id,
                      giftCardDetails.CardPin,
                      giftCardDetails.Balance
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};
const Event = async (input, done) => {
  console.log("------------order create event-----------------");
  try {
    const { shop, order } = input;

    let isGiftcardOrder = false;
    // let shopName = shop
    let shopName = "mmtteststore8.myshopify.com";
    console.log("Shop Name", shop);
    let settings = await store.findOne({ store_url: shopName });
    if (settings) {
      let newOrder = order;
      let qwikcilver_gift_cards = [];

      let shopify = await getShopifyObject(shopName); //Get the shopify object
      console.log(
        shopify,
        "----------------shopify object----------------------"
      );

      for (let line_item of newOrder.line_items) {
        //Check for the order lineitems whether it contains a QC Giftcard Product
        // gift_card_product = "";
        console.log(line_item);
        let gift_card_product = await product
          .findOne({
            id: line_item.product_id,
          })
          .lean(); //Get the product from DB

        console.log(
          "----------------------giftvcard product--------------",
          gift_card_product
        );

        if (gift_card_product) {
          //Check the product type
          isGiftcardOrder = true;
          let cpg_name = "12345";
          const storeOrder = await orders.create(order);
          qwikcilver_gift_cards.push(line_item);

          let giftCardDetails = await createGiftcard(
            shopName,
            parseInt(qwikcilver_gift_card.price),
            newOrder.id,
            gift_card_product.expiry_date
          );
        }
      }

      //If any QC Giftcard Products are found in the order line item
      if (qwikcilver_gift_cards && qwikcilver_gift_cards.length) {
        if (
          newOrder.financial_status == "paid" ||
          shopName === "mmtteststore8.myshopify.com"
        ) {
          for (let qwikcilver_gift_card of qwikcilver_gift_cards) {
            var email = null;
            var message = "";
            var sender = "";
            var receiver = "";
            if (qwikcilver_gift_card.properties) {
              for (let i = 0; i < qwikcilver_gift_card.properties.length; i++) {
                if (
                  qwikcilver_gift_card.properties[i].name === "Gift to Email"
                ) {
                  const storeOrder = await orders.updateOne({
                    id: order.id,
                    is_giftcard_order: true,
                  });
                  email = qwikcilver_gift_card.properties[i].value;
                }
                if (
                  qwikcilver_gift_card.properties[i].name === "_Gift to Email"
                ) {
                  email = qwikcilver_gift_card.properties[i].value;
                }
                if (qwikcilver_gift_card.properties[i].name === "_QC Message") {
                  message = qwikcilver_gift_card.properties[i].value;
                }
                if (
                  qwikcilver_gift_card.properties[i].name === "_sender_name"
                ) {
                  sender = qwikcilver_gift_card.properties[i].value;
                }
                if (
                  qwikcilver_gift_card.properties[i].name === "_recipient_name"
                ) {
                  receiver = qwikcilver_gift_card.properties[i].value;
                }
              }
              console.log(email);
              // email=qwikcilver_gift_card.properties["Gift to Email"]
            }
            if (qwikcilver_gift_card) {
              let item_quantity = [];
              for (let i = 0; i < qwikcilver_gift_card.quantity; i++) {
                item_quantity.push(1);
              }
              for (let quantity of item_quantity) {
                //Loop through the quantity
                //Create a QC Giftcard
                let giftCardDetails = await createGiftcard(
                  shopName,
                  parseInt(qwikcilver_gift_card.price),
                  newOrder.id,
                  gift_card_product.expiry_date
                );
                console.log(
                  giftCardDetails.CardPin,
                  "------------gc details---------------"
                );
                const walletCreated = await addGiftcardtoWallet(
                  order.customer.id,
                  giftCardDetails.CardPin,
                  store
                );

                console.log(
                  "---Done Processing",
                  quantity,
                  qwikcilver_gift_card.name
                );
              }
            }
          }
        }
      }
      // if (isGiftcardOrder == true) {
      //   let data = {
      //     shopName: shopName,
      //     orderId: newOrder.id,
      //   };

      //   }
    }
  } catch (error) {
    console.log(error);
    var err = new Error("Internal Server Error");
    err.status = 500;
  }
};

/**
 * Queue to handle webhooks
 */
const orderCreateQueue = new Queue(ordercreateEvent, {
  maxRetries: 2,
  retryDelay: 1000,
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
  } catch (err) {}
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

    await orders.updateOne({ store_url: store, id: orderData.id }, orderData, { upsert: true });
    console.log("Webhook Complieted");

  } catch (err) {
    logger.info(err);
    console.log(err);
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
      if (settings && settings.shopify_private_app) {
        let updatedProduct = req.body;
        updatedProduct.store = shopName;
        new processPrd(updatedProduct, shopName); //Update the data in DB
      }
    }
  } catch (err) {}
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
  }
};

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
