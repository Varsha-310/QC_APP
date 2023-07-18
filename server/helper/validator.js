import  Validator from "validatorjs";
import { respondInternalServerError, respondUnauthorized, respondValidationError } from "./response.js";
import crypto from "crypto";
import store from "../models/store.js";

/**
 * Created validator for Api
 * @param {*} body
 * @param {*} rules
 * @param {*} customMessages
 * @param {*} callback
 */
const validator = async (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

/**
 * Validation for get giftcard products
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const verifyGetGiftcard = async (req, res,next) => {
  try {
    console.log("api validation")
    const validationRule = {
      store: "required|string",
    };
    await validateParamsMethod(req,  validationRule, res , next);
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * Validation to resend email
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const verifySendEmail = async (req, res, next) => {
  try {
    console.log("api validation")
    const validationRule = {
      order_id: "required|string",
    };
    await validateParamsMethod(req,  validationRule, res , next);
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * Validation for  getWalletBalance API
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validateGetBalance = async (req, res, next) => {
  try {
    console.log("api validation")
    const validationRule = {
      store: "required|string",
      customer_id : "required|string"
    };
    await validateParamsMethod(req,  validationRule, res , next);
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};




/**
 * Validation for api
 * @param {*} req 
 * @param {*} validationRule 
 * @param {*} next 
 */
const validateParamsMethod = async (req, validationRule,res , next) => {
  try {
    await validator(req.query, validationRule, {}, (err, status) => {
      if (!status) {
        res.json(
          respondValidationError(err)
        );
      } else {
        console.log("api validation done");
        next();
      }
    });
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * Validation for  createGiftcard API
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validatecreateGiftcard = async (req, res, next) => {
  try {
    console.log("api validation")
    const validationRule = {
      title: "required|string",
      variants: "required|array",
      images: "required|array",
      validity: "required|string"

    };
    await validateMethod(req,  validationRule, res , next);
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * Validation for  updateGiftcard API
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validateUpdateGiftcard = async (req, res, next) => {
  try {
    console.log("api validation")
    const validationRule = {
      product_id: "required|string"
    };
    await validateMethod(req,  validationRule, res , next);
  } catch (err) {
console.log(err)
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * Validation for  addGiftcardtoWallet API
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validateAddToWallet = async (req, res, next) => {
  try {
    console.log("api validation")
    const validationRule = {
      customer_id : "required|string",
      store : "required|string",
      gc_pin: "required|string"

    };
    await validateMethod(req,  validationRule, res , next);
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};


/**
 * Validation for api
 * @param {*} req 
 * @param {*} validationRule 
 * @param {*} next 
 */
const validateMethod = async (req, validationRule, res, next) => {

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.json(respondValidationError(err));
    } else {
	console.log(err);
      next();
    }
  });
};



export const validategetStoresDataMethod = async (req, res, next, validationRule) => {
  try {
     await validator(req.query, validationRule, {}, (err, status) => {
      if (!status) {
        console.log(err)
        res.send(err);
      } else {
        next();
      }
    });
  }
  catch (err) {
    res.json( err,respondInternalServerError("Something went wrong try after sometime")
    )
  }
};


/**
 * Validation rules for the updateConfigapi route
 */
export const validateUpdateConfigApi = async (req, res, next) => {
  try {
    const validationRule = {
      prepaid: "required|string",
      cod: "required|string",
      giftCard: "required|string",
      giftcard_cash: "required|string",
      restock_type: "required|string",
      // location_id:"required|numeric",
    };
    await validateMethod(req, res, next, validationRule);
  } catch (err) {
    console.log(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};



/**
 * validate calculate refund api 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const validateRefundCalculate = async (req, res, next) => {

  try {
    
    const validationRule = {
      'orderId': "required|integer",
      'line_items': "required|array",
      'line_items.*.id': "required|integer",
      'line_items.*.qty': "required|integer"
    };
    await validateMethod(req, res, next, validationRule);
  } catch (err) {

    console.log(err);
    return res.json( respondInternalServerError() );
  }
};


/**
 * Validate Refund request
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const validateRefund = async (req, res, next) => {

  try {

    const validationRule = {
      'orderId': "required|integer",
      'line_items': "required|array",
      'line_items.*.id': "required|integer",
      'line_items.*.qty': "required|integer",
      "amount": "required|integer"
    };
    await validateMethod(req, res, next, validationRule);
  } catch (err) {

    return res.json(respondInternalServerError());
  }
};

/**
 * Compare received and generated hash to verify the webhook
 * @param req
 * @returns boolean
 */
export const verifyShopifyHook = async (req, res, next) => {

  try {
    
    console.log("in shopify webhook verification");
    const storeData = store.findOne({store_url : req.headers['X-Shopify-Shop-Domain']})
    const api_secret = storeData.access_token ?? "";
    const body = req.rawBody;
    console.log(body);
  
    const digest = crypto
      .createHmac("sha256", api_secret)
      .update(body)
      .digest("base64"); 
    const providedHmac = req.headers["x-shopify-hmac-sha256"]?.toString();
    console.log(providedHmac, digest)
    
    if (digest == providedHmac) {
      console.log("shopy webhook verified");
      next();
    } else {
      res.json(respondUnauthorized("not shopify webhook"));
    }
  } catch (e) {
    console.log(e);
    res.json(respondInternalServerError());
  }
};

/**
 * verify generated hash to verify api
 * @param {*} req
 * @param {*} res
 */
export const verifyHmacForApi = (req, res) => {
  try {
    const hmac_secret = process.env.HMAC_SECRET ?? "";
    const digest = crypto
      .createHmac("sha256", hmac_secret)
      .update(body)
      .digest("base64");
    const providedHmac = req.headers["Authorization"]?.toString();

    if (digest == providedHmac) {
      next();
    } else {
      res.json(respondUnauthorized("not a valid request"));
    }
  } catch (e) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};
