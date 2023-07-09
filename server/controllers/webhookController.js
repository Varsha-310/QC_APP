import { respondSuccess } from "../helper/response.js";
import { logger } from "../helper/utility.js";
import Queue from "better-queue";
import store from "../models/store.js";
import product from "../models/product.js";
import { getShopifyObject } from "../helper/shopify.js";
import { sendEmailViaSendGrid } from "../middleware/sendEmail.js";

/**
 * To handle order creation webhook
 * @param {*} req
 * @param {*} res
 */
export const orderCreated = (req, res) => {
  console.log("order created");
  const shop = req.headers.shop;
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
  res.json(respondSuccess("webhook received"));
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
const ordercreateEvent = async (input, done) => {
  console.log("------------order create event-----------------");
  try {
    const { shop, order } = input;

    let isGiftcardOrder = false;
    // let shopName = req.get("x-shopify-shop-domain");
    let shopName = "mmtteststore8.myshopify.com";
    console.log("Shop Name", shopName);
    let settings = await store.findOne({ store_url: shopName });
    // if(settings.qwikcilver_web_properties.emailTemplate){
    //      template=settings.qwikcilver_web_properties.emailTemplate;
    // }

    if (settings) {
      let newOrder = order;
      let qwikcilver_gift_cards = [];
      //Check whether the checkout ID is present in the Logs under the event "Redemption"

      //If yes, then mark the redemption as used
      let shopify = await getShopifyObject(shopName); //Get the shopify object
      console.log(
        shopify,
        "----------------shopify object----------------------"
      );
      // let transactions = await shopify.transaction.list(newOrder.id);
      //List all the transactions of the order
      //   transactions.map(async (transaction) => {
      //     if (transaction.gateway == "gift_card") {
      //       //See if the transaction is made with Shopify Gift Card
      //       //Check whether the transaction giftcard ID and the redemption Giftcard ID are same
      //       if (
      //         redeemedLogs.shopify_gift_card &&
      //         redeemedLogs.shopify_gift_card.id ==
      //         transaction.receipt.gift_card_id
      //       ) {
      //         //If yes, mark the redemption as used and store the relevant shopify order as well
      //         redeemedLogs.isUsed = true;
      //         redeemedLogs.shopify_order = newOrder;
      //         redeemedLogs.markModified("isUsed");
      //         redeemedLogs.markModified("shopify_order");
      //         console.log(
      //           newOrder.name,
      //           "Shopify Gift Card used - ",
      //           redeemedLogs.shopify_gift_card.id,
      //           redeemedLogs.shopify_gift_card.code
      //         );
      //         await redeemedLogs.save();
      //       }
      //     }
      //   });
      // }

      for (let line_item of newOrder.line_items) {
        //Check for the order lineitems whether it contains a QC Giftcard Product
        // gift_card_product = "";
        console.log(line_item);
        let gift_card_product = await product
          .findOne({
            id: line_item.product_id,
          })
          .lean(); //Get the product from DB

        console.log(gift_card_product);
        if (gift_card_product) {
          if (gift_card_product.product_type == "qwikcilver_gift_card") {
            //Check the product type
            isGiftcardOrder = true;
            let cpg_name = "12345";
            if (gift_card_product.tags.length) {
              // for (tag of gift_card_product.tags) {
              // if (tag.includes("cpgn_")) {
              //   cpg_name = tag;
              //   cpg_name = cpg_name.replace("cpgn_", "");
              //   cpg_name = cpg_name.replace(/_/g, " ");
              //   if (cpg_name.includes(",")) {
              //     cpg_name = cpg_name.split(",")[0];
              //     console.log(cpg_name);
              //   }
              // }
              // }
            }
            line_item["cpg_name"] = cpg_name;
            console.log("line_item", line_item);
            // console.log("cpgn_name", cpg_name);
            qwikcilver_gift_cards.push(line_item);
            //If yes, push the line item to an array
          }
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
            if (qwikcilver_gift_card.cpg_name.length) {
              let item_quantity = [];
              for (let i = 0; i < qwikcilver_gift_card.quantity; i++) {
                item_quantity.push(1);
              }
              for (let quantity of item_quantity) {
                //Loop through the quantity
                //Create a QC Giftcard
                // giftCardDetails = await createVoucher(
                //   shopName,
                //   parseInt(qwikcilver_gift_card.price),
                //   newOrder.id,
                //   "Giftcard created for " +
                //   newOrder.name +
                //   " - " +
                //   qwikcilver_gift_card.name,
                //   qwikcilver_gift_card.cpg_name
                // );
                // console.log(giftCardDetails);
                // console.log(giftCardDetails.createGiftCardResponse);
                // Save the information
                // await saveLogs(
                //   shopName,
                //   giftCardDetails.createGiftCardResponse,
                //   giftCardDetails.options.body,
                //   newOrder,
                //   qwikcilver_gift_card.name,
                //   qwikcilver_gift_card.id
                // );
                //If successful, send an email to the customer containg the newly generated QC Giftcard Details
                // if (
                //   giftCardDetails.createGiftCardResponse["ResponseCode"] == 0
                // ) {
                // await emailHelper.sendEmailViaSendGrid(
                //   giftCardDetails.createGiftCardResponse,
                //   newOrder,
                //   shopName,
                //   email,
                //   message,
                //   sender,
                //   receiver
                // );
                // }
                console.log(
                  "---Done Processing",
                  quantity,
                  qwikcilver_gift_card.name,
                  "| CPG - ",
                  qwikcilver_gift_card.cpg_name
                );
              }
            }
          }
        }
      }
      if (isGiftcardOrder == true) {
        let data = {
          shopName: shopName,
          orderId: newOrder.id,
        };
        // addTagToOrder(data);
        await sendEmailViaSendGrid(
          // giftCardDetails.createGiftCardResponse,
          newOrder,
          shopName,
          email,
          message,
          sender,
          receiver
        );
      }
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
      //   let status = verifyShopifyWebhook(
      //     req,
      //     settings.shopify_private_app.shared_secret
      //   );
      //   if (!status) {
      //     console.log("cannot verify request");
      //     return;
      //   }
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
