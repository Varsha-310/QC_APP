import { getShopifyObject } from "../helper/shopify";
import Product from "../models/product";
import {
  respondInternalServerError,
  respondSuccess,
  respondUnauthorized,
  respondNotFound,
  respondWithData,
  respondForbidden,
} from "../helper/response";
import Store from "../models/store";

import Wallet from "../models/wallet";
import {
  fetchBalance,
  addToWallet,
  createWallet,
} from "../middleware/qwikcilverHelper";

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
export const getGiftcardProducts = async (req, res, next) => {
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
 * to add giftcards to the wallet
 * @param {*} req
 * @param {*} res
 */
export const addGiftcardtoWallet = async (req, res) => {
  try {
    let { customer_id, gc_pin, store } = req.body;
    let Amount = 600;
    let walletExists = await Wallet.findOne({
      shopify_customer_id: customer_id,
    });
    console.log(walletExists, "-------***********----------");
    if (walletExists) {
      let wallet_id = walletExists.wallet_id;
      let shopify = await getShopifyObject(store);
      console.log("back ", shopify, walletExists.shopify_giftcard_id);
      let giftcard_req = {
        initial_value: parseInt(Amount),
        note: "Referrence: Qwikcilver Gift Card - ",
      };
      let updateShopifyGc = await shopify.giftCard.create({
        initial_value: 100,
      });
      console.log(updateShopifyGc, ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");
      let transaction = await addToWallet(wallet_id, gc_pin);
      console.log(transaction.data);
      if (transaction.status == 200) {
        res.json({
          ...respondWithData("giftcard added to wallet"),
          // data: updateShopifyGc.id,
        });
      } else {
        res.json(respondForbidden("invalid card credentials"));
      }
    } else {
      console.log("wallet doesnt exists");
      let walletCreated = await createWallet(customer_id);
      let giftcard_req = {
        initial_value: parseInt(amount),
        customer_id: customer_id,
      };

      let gift_card = await shopify.giftCard.create(giftcard_req);
      console.log("Shopify Gift Card Generated - ", gift_card.id);
      console.log(walletCreated);
    }
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

export const addGiftcardtoWallets = async (req, res) => {
  try {
    let { customer_id, gc_pin, store } = req.body;

    if ((gc_pin == "123456789", customer_id == "706173226297")) {
      res.json({
        ...respondWithData("card has been added to wallet"),
        data: "BW5RNW0YENO02GV9V",
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
    let storeExists = await Store.findOne({ store_url: store });
    console.log(storeExists);
    if (storeExists) {
      let walletExists = await Wallet.findOne({
        shopify_customer_id: customer_id,
      });
      if (walletExists) {
        let balanceFetched = await fetchBalance(walletExists.wallet_id);
        console.log(balanceFetched);
        res.json({
          ...respondWithData("balance fetched"),
          data: {
            balance: walletExists.balance,
            gc_id: walletExists.shopify_giftcard_id,
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
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

export const resendEmail = (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};
