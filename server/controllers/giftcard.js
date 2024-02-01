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
import axios from "../helper/axios.js";
import Wallet from "../models/wallet.js";
import {
  fetchBalance,
  addToWallet,
  createWallet,
  activateCard,
  checkWalletOnQC,resetCardPin
} from "../middleware/qwikcilver.js";
import wallet from "../models/wallet.js";
import wallet_history from "../models/wallet_history.js";
import orders from "../models/orders.js";
import qc_gc from "../models/qc_gc.js";
import { sendEmailViaSendGrid } from "../middleware/sendEmail.js";
import { getOrderTransactionDetails } from "./webhookController.js";
import OrderCreateEventLog from "../models/OrderCreateEventLog.js";
import addCard from "../models/addCard.js";

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

    for (let i = 0; i < variants.length; i++) {
      variants[i]["taxable"] = false;
      variants[i]["inventory_policy"] = "deny";
      variants[i]["inventory_management"] = null;
      variants[i]["requires_shipping"] = false;
    }
    let newProduct = await shopify.product.create({
      // Create a product in Shopify with the details sent in API
      title: title,
      template_suffix: "gift-card",
      body_html: description,
      terms,
      product_type: "qwikcilver_gift_card", //The product type is hardcode. This will be used to detect the product later
      images: images,
      tags: tags,
      variants: variants,
      status: "active",
    });
    const otherData = { validity: validity, terms: terms, store_url: store };
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
    res.json(respondInternalServerError());
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
    res.json(respondInternalServerError());
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
    res.json(respondInternalServerError());
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
    if (totalPages > 0) {
      products = await Product.find({ store_url: req.token.store_url })
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
    res.json(respondInternalServerError());
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
    res.json(respondInternalServerError());
  }
};

/**
 * adding giftcard to wallet
 * @param {*} req
 * @param {*} res
 */
export const addGiftcard = async (req, res) => {
  console.log(req.body);
  let gcToWallet = {};
  let logs = {};
  let { store, customer_id, gc_pin } = req.body;
  let validPin;
  const type = "giftcard";

  try {
    validPin = await qc_gc.findOne({ gc_pin: gc_pin });
    console.log("Pin validated", validPin);
    if (validPin) {
      const presentTime = new Date(Date.now());
      console.log(validPin.expiry_date, presentTime);
      if (validPin.expiry_date < presentTime) {
        res.json(respondForbidden("card is expired !"));
      } else {
        gcToWallet = await addGiftcardtoWallet(
          store,
          customer_id,
          gc_pin,
          validPin.balance,
          type,
          validPin.order_id,
          validPin.expiry_date,
          logs
        );

        logs = gcToWallet;
        await addCard.create({store :store, customerId : customer_id, logs:logs});
        console.log(JSON.stringify(logs));
        if (gcToWallet.status == "403") {
          return res.json(
            respondForbidden("card has been already added to wallet")
          );
        }
        if (gcToWallet.updateW.resp.ResponseCode == "0") {
          res.json({
            ...respondWithData("card has been added to wallet"),
          });
        }
	  if (gcToWallet.updateW.resp.ResponseCode == "10551") {
          res.json(respondForbidden("Wallet deactivated !"));
        } else {
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

    res.json(respondInternalServerError());
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
  type,
  order_id,
  expiry_date,
  logs = {},
  
) => {
  logs["status"] = false;
  let customer_wallet_id;
 
  try {
    const cardAlredyAdded = await wallet_history.findOne({
      "transactions.gc_pin": gc_pin,
    });
    if (cardAlredyAdded) {
      return { status: 403 };
    } else {
      const getStoreDetails = await Store.findOne({store_url : store})
      // activate Giftcard
      let activatedCardLog = logs?.activate?.status
        ? logs?.activate
        : await activateCard(store, gc_pin, logs?.activate);

      logs["activate"] = activatedCardLog;
      if (!activatedCardLog?.status) return logs;

      let activatedCard = activatedCardLog.resp.Cards[0];
      let checkWallet = logs?.checkWallet || { status: 0 };
      if ([0, 1].includes(checkWallet?.status)) {
        checkWallet = await checkWalletOnQC(
          store,
          customer_id,
          logs?.checkWallet
        );
        // console.log(" checking wallet on qc",checkWallet);
        logs["checkWallet"] = checkWallet;
        customer_wallet_id = checkWallet.resp.Wallets[0]["WalletNumber"]
        await Wallet.updateOne(
          {
            store_url: store,
            shopify_customer_id: customer_id,
          },
          {
            shopify_customer_id: customer_id,
            store_url: store,
            wallet_id: checkWallet.resp.Wallets[0]["WalletNumber"],
            WalletPin: checkWallet.resp.Wallets[0]["WalletPin"],
          },
          { upsert: true }
        );
        if (checkWallet.status === 1) throw Error("Error: Check Wallet");
      }
      if (checkWallet.status == 404) {
        const createWalletOnQc = await createWallet(
          store,
          customer_id,
          order_id,
          logs?.createWallet
        );
        console.log(JSON.stringify(createWalletOnQc));
        logs["createWallet"] = createWalletOnQc;
        if (!createWalletOnQc.status)
          throw Error("Error: Creating Wallet On WC");
        customer_wallet_id = createWalletOnQc["resp"].Wallets[0]["WalletNumber"]
        await Wallet.updateOne(
          {
            store_url: store,
            shopify_customer_id: customer_id,
          },
          {
            shopify_customer_id: customer_id,
            store_url: store,
            wallet_id: createWalletOnQc["resp"].Wallets[0]["WalletNumber"],
            WalletPin: createWalletOnQc["resp"].Wallets[0]["WalletPin"],
          },
          { upsert: true }
        );
        logs["checkWallet"]["status"] = 200;
      }
      if (!logs?.updateW?.status) {
        
        let transactionLog = logs?.updateW?.status
          ? logs?.updateW
          : await addToWallet(
              store,
              customer_wallet_id,
              gc_pin,
              activatedCard.CardNumber,
              logs?.updateW
            );
        logs["updateW"] = transactionLog;

        if (!transactionLog.status) throw new Error("Error: add card to wallet API");
      }
      const walletDetails = await Wallet.findOne({wallet_id :customer_wallet_id});
      if (!walletDetails.shopify_giftcard_id) {
        const createShopifyGC = await createShopifyGiftcard(
          store,
          getStoreDetails.access_token,
          amount
        );
        await Wallet.updateOne(
          {
            store_url: store,
            shopify_customer_id: customer_id,
          },
          {
            store_url: store,
            shopify_customer_id: customer_id,
            shopify_giftcard_id: createShopifyGC.id,
            shopify_giftcard_pin: createShopifyGC.code,
            balance:
              parseFloat(walletDetails?.balance || 0) + parseFloat(amount),
          },
          {
            upsert: true,
          }
        );
      } else {
        await updateShopifyGiftcard(
          store,
          getStoreDetails.access_token,
          walletDetails?.shopify_giftcard_id,
          amount
        );
        await Wallet.updateOne(
          {
            store_url: store,
            shopify_customer_id: customer_id,
          },
          {
            balance:
              parseFloat(walletDetails?.balance || 0) + parseFloat(amount),
          },
          {
            upsert: true,
          }
        );
      }
      logs["shopifyGC"] = {
        status: true,
        time: new Date().toISOString(),
      };
      let myDate = new Date();
      myDate.setDate(myDate.getDate() + parseInt(365));
      console.log(  "logs of order sesiion" , gc_pin);
       const wallet_history_update = await wallet_history.updateOne(
        {
          wallet_id: walletDetails.wallet_id,
          customer_id: customer_id,
        },
        {
          $push: {
            transactions: {
              transaction_type: "credit",
              amount: amount,
              expires_at:expiry_date,
              transaction_date: Date.now(),
              gc_pin :gc_pin,
              type: type,
            },
          },
        },
        { upsert: true }
      );
    }
    logs["status"] = true;
    return logs;
  } catch (err) {
    logs["error"] = err;
    console.log(err);
    //return false;
    return logs;
  }
};

/**
 * To fetch wallet balance
 * @param {*} req
 * @param {*} res
 */
export const getWalletBalance = async ({ query }, res) => {
  try {
    let { customer_id, store } = query;

    let storeExists = await Store.findOne({ store_url: store });
    if (!storeExists) {
      return res.json(respondUnauthorized("Invalid store"));
    }

    let walletExists = await Wallet.findOne({
      shopify_customer_id: customer_id,
    });
    if (!walletExists) {
      return res.json(respondNotFound("Wallet does not exist"));
    }

    console.log("wallet exists");

    let shopifybalance = await getShopifyGiftcard(
      store,
      storeExists.access_token,
      walletExists.shopify_giftcard_id
    );

    if (shopifybalance.disabled_at) {
      return res.json(respondNotFound("Wallet is deactivated"));
    }

    let qcBalance = await fetchBalance(store, walletExists.wallet_id);
    console.log("balance from qwikcilver giftcard", qcBalance.data.Cards[0]);

    if (qcBalance.data.Cards[0].ResponseCode === 10551) {
      return res.json(respondNotFound("Wallet is deactivated"));
    }

    if (qcBalance.data.Cards[0].ResponseCode === 0) {
      console.log(
        `qc balance:${qcBalance.data.Cards[0]} , shopify balance :${shopifybalance.balance}`
      );

      if (qcBalance.data.Cards[0].Balance < shopifybalance.balance) {
        let diffAmount =
          shopifybalance.balance - qcBalance.data.Cards[0].Balance;
        console.log(diffAmount, "diff amount");
        console.log("qc wallet balance is less");

        let updateShopifyGc = await updateShopifyGiftcard(
          store,
          storeExists.access_token,
          walletExists.shopify_giftcard_id,
          -diffAmount
        );
        await wallet_history.updateOne(
          { wallet_id: walletExists.wallet_id },
          {
            $push: {
              transactions: {
                transaction_type: "debit",
                amount: diffAmount,
                transaction_date: Date.now(),
              },
            },
          },
          { upsert: true });
        console.log(shopifybalance, "shopify giftcard balance");
        console.log(qcBalance, "qc wallet balance");
        if (qcBalance > shopifybalance) {
          res.json({
            ...respondWithData("balance fetched"),
            data: {
              balance: shopifybalance,
              gc_id: walletExists.shopify_giftcard_pin,
            },
          });
        } else {
          let updateShopifyGc = await updateShopifyGiftcard(
            store,
            storeExists.access_token,
            walletExists.shopify_giftcard_id,
            qcBalance
          );
          console.log("updated shopify giftcard", updateShopifyGc);
          res.json({
            ...respondWithData("balance fetched"),
            data: {
              balance: qcBalance,
              gc_id: walletExists.shopify_giftcard_pin,
            },
          });
        }
      } else {
        console.log(
          "Shopify balance is same or less than QC",
          qcBalance.data.Cards[0].Balance,
          shopifybalance.balance
        );
        res.json({
          ...respondWithData("Balance fetched"),
          data: {
            balance: parseFloat(shopifybalance.balance),
            gc_id: walletExists.shopify_giftcard_pin,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json(respondInternalServerError());
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

      console.log(giftCard, "---------------------------");
        const newPin = await resetCardPin(
        req.token.store_url,
        giftCard.gc_number
      );
      if (newPin != false) {
        await qc_gc.findOneAndUpdate({
          order_id: req.query.order_id},
          {gc_pin: newPin
        });
        await OrderCreateEventLog.findOne({
          orderId: req.query.order_id,
          "gift.createGC.resp.Cards[0].CardPin": newPin,
        });
        const giftCardDetails = {
          CardNumber: giftCard.gc_number,
          CardPin: newPin,
          Balance: giftCard.balance,
          ExpiryDate: giftCard.expiry_date,
        };
        console.log(giftCardDetails , "----------details of card---------------")

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
          image_url,
          orderExists.line_items[0].title
        );

        res.json(respondSuccess("email sent successfully"));
      } else {
        res.json(respondInternalServerError());
      }
    } else {
      res.json(respondNotFound("order does not exists"));
    }
  } catch (err) {
    console.log(err);
    res.json(respondInternalServerError());
  }
};

/**
 * order list of giftcard purchase
 * @param {*} req
 * @param {*} res
 */
// export const giftCardOrders = async (req, res) => {
//   try {
//     console.log(req.token);
//     const page = parseInt(req.query.page) || 1; // Current page number
//     const limit = parseInt(req.query.limit) || 10; // Number of items per page

//     const gcOrders = await orders
//       .find({ store_url: req.token.store_url })
//       .sort({ created_at: -1 });

//     console.log(gcOrders.length);

//     // Calculate the start and end index for the current page
//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;

//     // Extract the orders for the current page
//     const pagedOrders = gcOrders.slice(startIndex, endIndex);

//     const sortedOrders = pagedOrders.map((obj) => {
//       return {
//         id: obj.id,
//         order_number :obj.order_number,
//         customer: obj.customer,
//         created_at: obj.created_at,
//       };
//     });

//     console.log(sortedOrders, "----------------------------");
//     res.json({
//       ...respondWithData("fetched orders"),
//       data: sortedOrders,
//       total: gcOrders.length,
//     });
//   } catch (err) {
//     console.log(err);
//     res.json(
//       respondInternalServerError()
//     );
//   }
// };

export const giftCardOrders = async (req, res) => {
  try {
    let gcOrders;

    console.log(req.token);

    if (req.query.orderNo) {
      gcOrders = await orders.find({
        store_url: req.token.store_url,
        order_number: req.query.orderNo,
        cancel_reason:null
      });
      console.log(gcOrders);
    } else {
      console.log(req.query);
      if (req.query.startDate && req.query.endDate) {
        console.log("-------------in filtering orders by date--------------");
        gcOrders = await orders
          .find({
            $and: [
              {
                store_url: req.token.store_url,
                cancel_reason:null,
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
          .find({ store_url: req.token.store_url,cancel_reason:null})
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
    const history = await wallet_history
      .findOne({ customer_id: customer_id })
      .select("-transactions.gc_pin");
    console.log("History Length: ", history);
    if (history == null) {
      res.json(respondNotFound("wallet does not exists"));
    } else {
let transactions = history.transactions
      for(let i=0;i<transactions.length; i++){
	if(transactions[i].expires_at){
        const convertedDate = new Date(transactions[i].expires_at);
        console.log(convertedDate , "convert")
        convertedDate.setUTCHours(convertedDate.getUTCHours() + 5, convertedDate.getUTCMinutes() + 30);
        transactions[i].expires_at = convertedDate.toISOString();
      }
	}
      res.json({
        ...respondWithData("fetched wallet transaction"),
        data: {
          balance: 0,
          transactions: transactions.reverse(),
        },
      });
    }
  } catch (err) {
    console.log("Error: ", JSON.stringify(err));
    res.json(respondInternalServerError());
  }
};

/**
 * checking amount paid by gitcard.
 * @param {*} req
 * @param {*} res
 */
export const giftCardAmount = async (storeUrl, id, customer_id) => {
  try {
    const storeData = await Store.findOne({ store_url: storeUrl });
    let transactions = await getOrderTransactionDetails(
      id,
      storeUrl,
      storeData.access_token
    );
    let fetchTransaction = transactions.data.transactions.find(
      (trans) => trans.gateway == "gift_card"
    );
    console.log(JSON.stringify(fetchTransaction));
    const giftcardExists = await wallet.findOne({
      shopify_giftcard_id: fetchTransaction.receipt.gift_card_id,
      shopify_customer_id: customer_id,
    });
    if (giftcardExists) {
      const redeemAmount = fetchTransaction.amount;
      return {
        error: false,
        amount: redeemAmount,
        id: giftcardExists.wallet_id,
      };
    } else {
      return { error: true, msg: "Wallet Not Found" };
    }
  } catch (err) {
    console.log(err);
    return { error: true, msg: err?.message };
  }
};

/**
 * create shopify giftcard
 * @param {*} store
 * @param {*} token
 * @param {*} amount
 * @returns
 */
export const createShopifyGiftcard = async (store, token, amount) => {
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
    console.log(JSON.stringify(err));
    throw new Error("Shopify GC Creation Error");
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
    ///console.log(shopifyGc.data.gift_card);
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
export const updateShopifyGiftcard = async (store, token, id, amount) => {
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
    return shopifyGc.data.adjustment;
  } catch (err) {
    console.log(err);
    throw new Error("Shopify GC adjustment Error");
  }
};

/**
 * to add giftcards to the wallet
 * @param {*} req
 * @param {*} res
 */
export const refundAsStoreCredit = async (
  store,
  amount,
  order_id,
  validity,
  customer = {},
  logs = {}
) => {
  logs["status"] = false;
  try {
    const cardAlredyAdded = await wallet_history.findOne({
      "transactions.gc_pin": gc_pin,
    });
    if (cardAlredyAdded) {
      return { status: 403 };
    } else {
      // activate Giftcard
      let activatedCardLog = logs?.activate?.status
        ? logs?.activate
        : await activateCard(store, gc_pin, logs?.activate);

      logs["activate"] = activatedCardLog;
      if (!activatedCardLog?.status) return logs;

      let activatedCard = activatedCardLog.resp.Cards[0];
      const setting = await Store.findOne({ store_url: store });
      let walletExists = await Wallet.findOne({
        shopify_customer_id: customer_id,
      });
      const shopify_gc_id = walletExists.shopify_giftcard_id;
      if (walletExists) {
        let wallet_id = walletExists.wallet_id;
        const shopify_gc_id = walletExists.shopify_giftcard_id;
        const newAmount = walletExists.balance + amount;
        console.log(newAmount);
        let transactionLog = logs?.updateW?.status
          ? logs?.updateW
          : await addToWallet(
              store,
              wallet_id,
              gc_pin,
              activatedCard.CardNumber,
              logs?.updateW
            );
        logs["updateW"] = transactionLog;
        if (!transactionLog?.status) return logs;
        else {
          if (!logs?.wallet?.shopifyGCUpdateAt) {
            let updateShopifyGc = await updateShopifyGiftcard(
              store,
              setting.access_token,
              shopify_gc_id,
              amount
            );
            console.log(updateShopifyGc);
            logs["shopifyGCUpdateAt"] = new Date().toISOString();
          }

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
                  type: type,
                },
              },
            },
            { upsert: true }
          );
          walletExists.balance =
            parseFloat(walletExists.balance) + parseFloat(amount);
          logs["status"] = true;
        }
      } else {
        console.log("wallet doesnt exists");
        let walletCreatedLog = await createWallet(
          store,
          customer_id,
          order_id,
          logs?.createW
        );
        logs["createW"] = walletCreatedLog;
        if (!walletCreatedLog?.status) return logs;

        let walletCreated = walletCreatedLog.resp.Wallets[0];
        console.log("activated card balance", activatedCard);
        let gift_card = {};
        //if (logs?.shopifyGCCreatedAt) {
        gift_card = await createShopifyGiftcard(
          store,
          setting.access_token,
          activatedCard.Balance
        );
        console.log("Shopify Gift Card Generated - ", gift_card);
        logs["shopifyGCCreatedAt"] = new Date().toISOString();
        //}

        console.log(walletCreated, "walletcreated");
        await wallet.updateOne(
          {
            wallet_id: walletCreated.WalletNumber,
            shopify_customer_id: customer_id,
          },
          {
            wallet_id: walletCreated.WalletNumber,
            shopify_customer_id: customer_id,
            shopify_giftcard_id: gift_card.id,
            shopify_giftcard_pin: gift_card.code,
          },
          { upsert: true }
        );

        let transactionLog = logs?.updateW?.status
          ? logs?.updateW
          : await addToWallet(
              store,
              walletCreated.WalletNumber,
              gc_pin,
              activatedCard.CardNumber,
              logs?.updateW
            );
        logs["updateW"] = transactionLog;
        if (!transactionLog?.status) return logs;
        else {
          logs["status"] = true;
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
                  type: type,
                },
              },
            },
            { upsert: true }
          );
        }
      }
    }
    return logs;
  } catch (err) {
    logs["error"] = err;
    console.log(err);
    return logs;
  }
};
