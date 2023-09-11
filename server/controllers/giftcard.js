import { getShopifyObject } from "../helper/shopify.js";
import Product from "../models/product.js";
import {
  respondInternalServerError,
  respondSuccess,
  respondUnauthorized,
  respondNotFound,
  respondWithData,
  respondForbidden,
} from "../helper/response.js";
import Store from "../models/store.js";
import axios from "axios";
import Wallet from "../models/wallet.js";
import {
  fetchBalance,
  addToWallet,
  createWallet,
  activateCard,
} from "../middleware/qwikcilver.js";
import wallet from "../models/wallet.js";
import wallet_history from "../models/wallet_history.js";
import orders from "../models/orders.js";
import qc_gc from "../models/qc_gc.js";
import store from "../models/store.js";
import { sendEmailViaSendGrid } from "../middleware/sendEmail.js";

/**
 * To create gifcard product
 * @param {*} req
 * @param {*} res
 */
export const createGiftcardProducts = async (req, res) => {
  try {
    console.log("createGiftcardProducts function start");
    let store = req.token.store_url;
    let { description, title, images, variants, validity, terms } = req.body;
    console.log(store);
    let shopify = await getShopifyObject(store);
    console.log("createGiftcardProducts test1");
    let tags = "qc_giftcard";
    console.log("createGiftcardProducts shopify call start");
    console.log("Body shopify");

    let newProduct = await shopify.product.create({
      // Create a product in Shopify with the details sent in API
      title: title,
      body_html: description,
      terms,
      product_type: "qwikcilver_gift_card", //The product type is hardcode. This will be used to detect the product later
      images: images,
      tags: tags,
      variants: variants,
      status: "active",
      store_url: store,
    });
    const otherData = { validity: validity, terms: terms };
    const createP = {
      ...newProduct,
      ...otherData,
    };
    await Product.create(createP);
    console.log("createGiftcardProducts response shopify");
    console.log(newProduct);
    res.json(respondSuccess("Product created in shopify successfully"));
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * Update giftcard product
 * @param {*} req
 * @param {*} res
 */
export const updateGiftcardProduct = async (req, res) => {
  try {
    let store = req.token.store_url;
    let { images, title, description, variants, product_id, validity, terms } =
      req.body;
    let shopify = await getShopifyObject(store); // Get Shopify Object
    let updateObj = {};
    //Update only the fields sent in request
    if (images && images.length >= 0) {
      updateObj["images"] = images;
    }
    if (title) {
      updateObj["title"] = title;
    }
    if (description) {
      updateObj["body_html"] = description;
    }
    if (variants) {
      updateObj["variants"] = variants;
    }
    console.log(updateObj);
    let updatedProduct = await shopify.product.update(product_id, updateObj);
    if (validity) {
      updateObj["validity"] = validity;
    }
    if (terms) {
      updateObj["terms"] = terms;
    }
    await Product.updateOne(
      { id: product_id },
      { updateObj },
      { upsert: true }
    );

    console.log(updatedProduct);
    res.json(respondSuccess("Product updated in shopify successfully"));
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * Delet giftcard product
 * @param {*} req
 * @param {*} res
 */
export const deleteGiftcardProducts = async (req, res) => {
  try {
    console.log("deleteGiftcardProducts function start");
    let store = req.token.store_url;
    let { product_id } = req.body;
    console.log(store);
    let shopify = await getShopifyObject(store); //Get Shopify Object

    let newProduct = await shopify.product.delete(product_id);
    await Product.deleteOne({ id: product_id });
    console.log(newProduct);
    res.json(respondSuccess("Product deleted in shopify successfully"));
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};
/**
 * To fetch giftcard products
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getGiftcardProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Number of items per page (default: 10)

    const count = await Product.countDocuments({
      store_url: req.token.store_url,
    });
    const totalPages = Math.ceil(count / limit);

    // Adjust the page value if it exceeds the total number of pages
    const currentPage = page > totalPages ? totalPages : page;

    console.log(req.token.store_url);
    let products;
if(totalPages > 0){
      products =  await Product.find({ store_url: req.token.store_url })
      .sort({ created_at: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit);
}
    console.log(products);
    res.json({
      success: true,
      message: "Giftcard Products fetched successfully",
      code: "200",
      data: products,
      count,
    });
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * to fetch singl gc product
 * @param {*} req
 * @param {*} res
 */
export const getSelectedGc = async (req, res) => {
  try {
    let product_id = parseInt(req.body.product_id);
    let productSelect = await Product.findOne({ id: product_id });
    console.log(productSelect);
    res.json({
      ...respondWithData("fetched product"),
      data: productSelect,
    });
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * adding giftcard to wallet
 * @param {*} req
 * @param {*} res
 */
export const addGiftcard = async (req, res) => {
  try {
    let { store, customer_id, gc_pin } = req.body;
    const type = "giftcard";
    const validPin = await qc_gc.findOne({ gc_pin: gc_pin });
    if (validPin) {
      const presentTime = new Date(Date.now());
      console.log(validPin.expiry_date, presentTime);
      if (validPin.expiry_date < presentTime) {
        res.json(respondForbidden("card is expired !"));
      } else {
        const gcToWallet = await addGiftcardtoWallet(
          store,
          customer_id,
          gc_pin,
          validPin.balance,
          type
        );
        if (gcToWallet.status == "403") {
          res.json(respondForbidden("card has been already added to wallet"));
        } 
        if (gcToWallet.ResponseCode == "0") {
          res.json({
            ...respondWithData("card has been added to wallet"),
          });
        }
          else {
          res.json(
            respondInternalServerError(
              "Something went wrong try after sometime"
            )
          );
        }
      }
    } else {
      res.json(respondForbidden("invalid card credentials"));
    }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * to add giftcards to the wallet
 * @param {*} req
 * @param {*} res
 */
export const addGiftcardtoWallet = async (
  store,
  customer_id,
  gc_pin,
  amount,
  type
) => {
  try {
    const cardAlredyAdded = await wallet_history.findOne({
      "transactions.gc_pin": gc_pin,
    });
    if (cardAlredyAdded) {
      return { status: 403 };
    } else {
      const setting = await Store.findOne({ store_url: store });
      let walletExists = await Wallet.findOne({
        shopify_customer_id: customer_id,
      });
      console.log(walletExists, "-------***********------");
      if (walletExists) {
        let wallet_id = walletExists.wallet_id;
        const shopify_gc_id = walletExists.shopify_giftcard_id;
        console.log("back ", walletExists.shopify_giftcard_id);
        const newAmount = walletExists.balance + amount;
        console.log(newAmount);
        let activatedCard = await activateCard(store, gc_pin);

        let transaction = await addToWallet(
          store,
          wallet_id,
          gc_pin,
          activatedCard.CardNumber
        );
        console.log(transaction);
        if (
          (transaction.status == "200", transaction.data.ResponseCode == "0")
        ) {
          let updateShopifyGc = await updateShopifyGiftcard(
            store,
            setting.access_token,
            shopify_gc_id,
            amount
          );
          console.log(updateShopifyGc);
          await wallet_history.updateOne(
            { wallet_id: wallet_id, customer_id: customer_id },
            {
              $push: {
                transactions: {
                  transaction_type: "credit",
                  amount: amount,
                  gc_pin: gc_pin,
                  expires_at: activatedCard.ExpiryDate,
                  transaction_date: Date.now(),
                  type:type
                },
              },
            },
            { upsert: true }
          );
          walletExists.balance =
            parseFloat(walletExists.balance) + parseFloat(amount);
          return transaction.data;
        } else {
          return false;
        }
      } else {
        console.log("wallet doesnt exists");
        let walletCreated = await createWallet(store, customer_id);
        let activatedCard = await activateCard(store, gc_pin);
        console.log("activated card balance", activatedCard);
        let gift_card = await createShopifyGiftcard(
          store,
          setting.access_token,
          activatedCard.Balance
        );
        console.log("Shopify Gift Card Generated - ", gift_card);
        console.log(walletCreated, "walletcreated");
        await wallet.create({
          wallet_id: walletCreated.WalletNumber,
          shopify_customer_id: customer_id,
          shopify_giftcard_id: gift_card.id,
          shopify_giftcard_pin: gift_card.code,
        });
        let transaction = await addToWallet(
          store,
          walletCreated.WalletNumber,
          gc_pin,
          activatedCard.CardNumber
        );
        console.log(transaction);
        if (
          (transaction.status == "200", transaction.data.ResponseCode == "0")
        ) {
          await wallet.updateOne(
            { shopify_customer_id: customer_id },
            { $inc: { balance: activatedCard.Balance } },
            { upsert: true }
          );
          await wallet_history.updateOne(
            { wallet_id: walletCreated.WalletNumber, customer_id: customer_id },
            {
              $push: {
                transactions: {
                  transaction_type: "credit",
                  amount: amount,
                  transaction_date: Date.now(),
                  expires_at: activatedCard.ExpiryDate,
                  type:type
                },
              },
            },
            { upsert: true }
          );

          return transaction.data;
        } else {
          return false;
        }
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * To fetch wallet balance
 * @param {*} req
 * @param {*} res
 */
export const getWalletBalance = async (req, res) => {
  try {
    let { customer_id, store } = req.query;
    console.log(req.query);
    let storeExists = await Store.findOne({ store_url: store });
    console.log(storeExists);
    if (storeExists) {
      let walletExists = await Wallet.findOne({
        shopify_customer_id: customer_id,
      });
      console.log("-----------------", walletExists);
      if (walletExists) {
        let balanceFetched = await fetchBalance(store, walletExists.wallet_id);
        let shopifybalance = await getShopifyGiftcard(
          store,
          storeExists.access_token,
          walletExists.shopify_giftcard_id
        );
        console.log(shopifybalance, "shopify giftcard balance");
        console.log(balanceFetched);
        res.json({
          ...respondWithData("balance fetched"),
          data: {
            balance: balanceFetched,
            gc_id: walletExists.shopify_giftcard_pin,
          },
        });
      } else {
        res.json(respondNotFound("wallet does not exists"));
      }
    } else {
      res.json(respondUnauthorized("Invalid store"));
    }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * resend email for particular order
 * @param {*} req
 * @param {*} res
 */
export const resendEmail = async (req, res) => {
  try {
    
    console.log(req.token.store_url, "stsore");
    const orderExists = await orders.findOne({
      store_url: req.token.store_url,
      id: req.query.order_id,
    });

    if (orderExists) {
      console.log("-------------", orderExists);
      const giftCard = await qc_gc.findOne({ order_id: req.query.order_id });
      const giftCardDetails = {
        CardNumber: giftCard.gc_number,
        CardPin: giftCard.gc_pin,
        Balance: giftCard.balance,
        ExpiryDate: giftCard.expiry_date,
      };
      console.log(giftCard, "---------------------------");

      let email = null;
      let message = "";
      let receiver = "";
      let image_url = "";
      const qwikcilver_gift_card = orderExists.line_items[0].properties;
      console.log(
        qwikcilver_gift_card,
        "----------------founf-----------------"
      );
      for (let i = 0; i < qwikcilver_gift_card.length; i++) {
        console.log(qwikcilver_gift_card[i].value, "--------------", i);
        if (qwikcilver_gift_card[i].name === "_Qc_img_url") {
          image_url = qwikcilver_gift_card[i].value;
        }
        if (qwikcilver_gift_card[i].name === "_Qc_recipient_email") {
          email = qwikcilver_gift_card[i].value;
        }
        if (qwikcilver_gift_card[i].name === "_Qc_recipient_message") {
          message = qwikcilver_gift_card[i].value;
        }

        if (qwikcilver_gift_card[i].name === "_Qc_recipient_name") {
          receiver = qwikcilver_gift_card[i].value;
        }
      }
      await sendEmailViaSendGrid(
        req.token.store_url,
        giftCardDetails,
        receiver,
        email,
        message,
        image_url
      );

      res.json(respondSuccess("email sent successfully"));
    } else {
      res.json(respondNotFound("order does not exists"));
    }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * order list of giftcard purchase
 * @param {*} req
 * @param {*} res
 */
export const giftCardOrders = async (req, res) => {
  try {
    let gcOrders;

    console.log(req.token);

    if (req.query.orderNo) {
       gcOrders = await orders.find({
        store_url: req.token.store_url,
        order_number: req.query.orderNo,
      });
      console.log(gcOrders)
     
    } else {
      console.log(req.query)
      if (req.query.startDate && req.query.endDate) {
        console.log("-------------in filtering orders by date--------------");
        gcOrders = await orders
          .find({
            $and: [
              {
                store_url: req.token.store_url,
                created_at: {
                  $gte: new Date(req.query.startDate),
                  $lte: new Date(req.query.endDate),
                },
              },
            ],
          })
          .sort({ created_at: -1 });
      } else {
        gcOrders = await orders
          .find({ store_url: req.token.store_url })
          .sort({ created_at: -1 });
      }
    }
      const page = parseInt(req.query.page) || 1; // Current page number
      const limit = parseInt(req.query.pageSize) || 10; // Number of items per page

      console.log(gcOrders.length);

      // Calculate the start and end index for the current page
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // Extract the orders for the current page
      const pagedOrders = gcOrders.slice(startIndex, endIndex);

      const sortedOrders = pagedOrders.map((obj) => {
        return {
          id: obj.id,
          order_number: obj.order_number,
          customer: obj.customer,
          created_at: obj.created_at,
        };
      });
      res.json({
        ...respondWithData("fetched orders"),
        data: sortedOrders,
        total: gcOrders.length,
      });
    
  } catch (err) {
    console.log(err);
    res.json(respondInternalServerError());
  }
};
/**
 * to fetch wallet trasnaction
 * @param {*} req
 * @param {*} res
 */
export const walletTransaction = async (req, res) => {
  try {
    const { store, customer_id } = req.body;
    console.log(store, customer_id);
    const cust = Number(customer_id);
    const history = await wallet_history.findOne({ customer_id: customer_id });
    console.log(history, "-----wallethistory------------");
    if (history == null) {
      res.json(respondNotFound("wallet does not exists"));
    } else {
	const walletHistory =  history.transactions;
	delete walletHistory.gc_pin
      res.json({
        ...respondWithData("fetched wallet transaction"),
        data: {
          balance: 980,
          transactions: walletHistory.reverse(),
        },
      });
    }
  } catch (err) {
    console.log(err);
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
export const giftCardAmount = async (store, id) => {
  try {
    let shopify = await getShopifyObject(store);
    let fetchTransaction = await shopify.transaction.list(id);
    console.log(fetchTransaction, "transaction");
    fetchTransaction.gateway = "gift_card";
    if (fetchTransaction.gateway == "gift_card") {
      const giftcardExists = await wallet.findOne({
        shopify_giftcard_id: fetchTransaction[0].receipt.gift_card_id,
      });
      console.log(giftcardExists);
      if (giftcardExists) {
        const redeemAmount = fetchTransaction[0].amount;
        console.log("shopify gc reedemded", fetchTransaction[0].id);
        return { amount: redeemAmount, id: giftcardExists.wallet_id };
      } else {
        return false;
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * create shopify giftcard
 * @param {*} store
 * @param {*} token
 * @param {*} amount
 * @returns
 */
const createShopifyGiftcard = async (store, token, amount) => {
  try {
    let data = JSON.stringify({
      gift_card: {
        initial_value: amount,
      },
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://${store}/admin/api/2023-07/gift_cards.json`,
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const shopifyGc = await axios(config);
    console.log(shopifyGc.data.gift_card);
    return shopifyGc.data.gift_card;
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * get shopify giftcard
 * @param {*} store
 * @param {*} token
 * @param {*} id
 * @returns
 */
const getShopifyGiftcard = async (store, token, id) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://${store}/admin/api/2023-07/gift_cards/${id}.json`,
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
    };

    const shopifyGc = await axios(config);
    console.log(shopifyGc.data.gift_card);
    return shopifyGc.data.gift_card;
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * to update amount of shopify giftcard
 * @param {*} store
 * @param {*} token
 * @param {*} id
 * @param {*} amount
 * @returns
 */
const updateShopifyGiftcard = async (store, token, id, amount) => {
  try {
    console.log("----------------amount--------------------", amount);
    let data = JSON.stringify({
      adjustment: {
        amount: amount,
      },
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://${store}/admin/api/2023-07/gift_cards/${id}/adjustments.json`,
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    const shopifyGc = await axios(config);
    console.log(
      shopifyGc.data,
      "--------------------shopify giftcard data-----------"
    );
    return shopifyGc.data.adjustment;
  } catch (err) {
    console.log(err);
    return false;
  }
};
