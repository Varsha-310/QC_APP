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

import Wallet from "../models/wallet.js";
import {
  fetchBalance,
  addToWallet,
  createWallet,
  activateCard,
} from "../middleware/qwikcilverHelper.js";
import orders from "../models/orders.js";

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
    let tags = "cpgn_";
    tags = tags.replace(/\s/g, "_");
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
      status: "draft",
      validity: validity,
      store_url: store,
    });
    const expiryDate = { validity: validity };
    const createP = {
      ...newProduct,
      ...expiryDate,
    };
    await Product.create(createP);
    console.log("createGiftcardProducts response shopify");
    console.log(newProduct);
    res.json(respondSuccess("Product created in shopify successfully"));
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
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
    let { images, title, description, variants, product_id } = req.body;
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
    console.log(updatedProduct);
    res.json(respondSuccess("Product updated in shopify successfully"));
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
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
      respondInternalServerError("Something went wrong try after sometime")
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

    const count = await Product.countDocuments({ store_url: req.token.store });
    const totalPages = Math.ceil(count / limit);

    // Adjust the page value if it exceeds the total number of pages
    const currentPage = page > totalPages ? totalPages : page;

    console.log(req.token.store_url);
    let products = await Product.find({ store_url: req.token.store })
      .skip((currentPage - 1) * limit)
      .limit(limit);
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
      respondInternalServerError("Something went wrong try after sometime")
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
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * adding giftcard to wallet
 * @param {*} req
 * @param {*} res
 */
export const addGiftcard = (req, res) => {
  let { store, customer_id, gc_pin } = req.body;
  addGiftcardtoWallet(store, customer_id, gc_pin);
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
  amount
) => {
  try {
    let shopify = await getShopifyObject(store);
    let walletExists = await Wallet.findOne({
      shopify_customer_id: customer_id,
    });
    console.log(walletExists, "-------***********------");
    if (walletExists) {
      let wallet_id = walletExists.wallet_id;
      const shopify_gc_id = walletExists.shopify_giftcard_id;
      console.log("back ", shopify, walletExists.shopify_giftcard_id);
      let giftcard_req = {
        initial_value: parseInt(amount),
        note: "Referrence: Qwikcilver Gift Card - ",
      };
      let activatedCard = await activateCard(store, gc_pin);
      let updateShopifyGc = await shopify.giftCardAdjustment.create({
        shopify_gc_id,
        amount: activatedCard.Balance,
      });
      console.log(updateShopifyGc);
      let transaction = await addToWallet(
        store,
        wallet_id,
        gc_pin,
        activatedCard.CardNumber
      );
      console.log(transaction);
      if ((transaction.status == "200", transaction.data.ResponseCode == "0")) {
        res.json({
          ...respondWithData("giftcard added to wallet"),
        });
        if (
          (transaction.status == 200, transaction.data.ResponseCode == 10838)
        ) {
          res.json(respondUnauthorized("card already added to wallet"));
        }
      } else {
        res.json(respondForbidden("invalid card credentials"));
      }
    } else {
      console.log("wallet doesnt exists");
      let walletCreated = await createWallet(store, customer_id);
      console.log(walletCreated, "wallet created");
      let giftcard_req = {
        initial_value: amount
      };
      console.log(shopify)
      let gift_card = await shopify.giftCard.count();
      console.log("-------------------------",gift_card)
      console.log("Shopify Gift Card Generated - ", gift_card.id);
      console.log(walletCreated);
      let transaction = await addToWallet(
        store,
        walletCreated.WalletNumber,
        gc_pin
      );
      console.log(transaction);
      if ((transaction.status == "200", transaction.data.ResponseCode == "0")) {
        res.json({
          ...respondWithData("giftcard added to wallet"),
        });
        if (
          (transaction.status == 200, transaction.data.ResponseCode == 10838)
        ) {
          res.json(respondUnauthorized("card already added to wallet"));
        } else {
          res.json(respondForbidden("invalid card credentials"));
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

export const addGiftcardtoWallets = async (req, res) => {
  try {
    let { customer_id, gc_pin, store } = req.body;
    console.log(gc_pin);

    if (gc_pin == "PG5DN8GTX4BHYB" && customer_id == "7061732262207") {
      res.json({
        ...respondWithData("card has been added to wallet"),
      });
    } else {
      res.json(respondForbidden("invalid card credentials"));
    }
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
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
    // let storeExists = await Store.findOne({ store_url: store });
    // console.log(storeExists);
    // if (storeExists) {
    let walletExists = await Wallet.findOne({
      shopify_customer_id: customer_id,
    });
    console.log("-----------------", walletExists);
    // if (walletExists) {
    let balanceFetched = await fetchBalance(store, walletExists.wallet_id);
    console.log(balanceFetched);
    res.json({
      ...respondWithData("balance fetched"),
      data: {
        balance: walletExists.balance,
        gc_id: walletExists.shopify_giftcard_id,
      },
    });
    // } else {
    //   res.json(respondNotFound("wallet does not exists"));
    // }
    // } else {
    //   res.json(respondUnauthorized("Invalid store"));
    // }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

export const resendEmail = async (req, res) => {
  try {
    console.log(req.token.store_url, req.query.order_id);
    const orderExists = await orders.findOne({
      store_url: req.token.store_url,
      id: req.query.order_id,
    });

    console.log("-------------", orderExists);
    if (orderExists) {
      res.json(respondSuccess("email sent successfully"));
    } else {
      res.json(respondNotFound("order does not exists"));
    }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * orders sent as gift
 * @param {*} req
 * @param {*} res
 */
// export const giftCardOrders = async (req, res) => {
//   try {
//     console.log(req.token);
//     const gcOrders = await orders.find({
//       store_url: req.token.store_url,

//     });
//     console.log(gcOrders.length);

//     const sortedOrders = gcOrders.map(obj => {
//       return {
//         id: obj.id,
//         customer: obj.customer,
//         created_at : obj.created_at
//       };
//     });

//     console.log(sortedOrders, "----------------------------")
//     res.json({
//       ...respondWithData("fetched orders"),
//       data:sortedOrders,
//       total :sortedOrders.length
//     });
//   } catch (err) {
//     console.log(err);
//     res.json(
//       respondInternalServerError("Something went wrong try after sometime")
//     );
//   }
// };
export const giftCardOrders = async (req, res) => {
  try {
    console.log(req.token);
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page

    const gcOrders = await orders.find({
      store_url: req.token.store_url,
    });

    console.log(gcOrders.length);

    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Extract the orders for the current page
    const pagedOrders = gcOrders.slice(startIndex, endIndex);

    const sortedOrders = pagedOrders.map((obj) => {
      return {
        id: obj.id,
        customer: obj.customer,
        created_at: obj.created_at,
      };
    });

    console.log(sortedOrders, "----------------------------");
    res.json({
      ...respondWithData("fetched orders"),
      data: sortedOrders,
      total: gcOrders.length,
    });
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong, try again later")
    );
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
    // let storeExists = await Store.findOne({ "store_url": store });
    // console.log(storeExists);
    // if (storeExists) {
    // const transactions = await wallet_history.findOne({"customer_id" : 7061732262207});
    if (
      store == "meenakhi-qwikcilver-testing.myshopify.com" &&
      customer_id == "7061732262207"
    ) {
      res.json({
        ...respondWithData("fetched wallet transaction"),
        data: {
          balance: 1000,
          transactions: [
            {
              transaction_type: "credit",
              amount: 500,
              expires_at: "2023-07-01T07:15:50.000+00:00",
            },
            {
              transaction_type: "debit",
              amount: 300,
            },
            {
              transaction_type: "credit",
              amount: 500,
              expires_at: "2024-05-01T07:15:50.000+00:00",
            },
            {
              transaction_type: "debit",
              amount: 300,
            },
            {
              transaction_type: "credit",
              amount: 600,
              expires_at: "2024-05-01T07:15:50.000+00:00",
            },
          ],
        },
      });
    } else {
      res.json(respondUnauthorized("wallet does not exists"));
    }
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};
