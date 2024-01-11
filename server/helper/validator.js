import  Validator from "validatorjs";
import { errorMsg, respondInternalServerError, respondUnauthorized, respondValidationError } from "./response.js";
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
    res.json(respondInternalServerError());
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
    res.json(respondInternalServerError());
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
    res.json(respondInternalServerError());
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
    res.json( respondInternalServerError());
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
    res.json( respondInternalServerError());
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
    res.json(respondInternalServerError());
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
      store : "required|string"

    };
    await validateMethod(req,  validationRule, res , next);
  } catch (err) {

    res.json(respondInternalServerError());
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

    res.json(respondInternalServerError())
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
      //location_id:"required|numeric",
    };
    await validateMethod(req,  validationRule, res , next);
  } catch (err) {

    console.log(err);
    res.json(respondInternalServerError());
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
    await validateMethod(req,  validationRule, res , next);
  } catch (err) {

    console.log(err);
    return res.json(respondInternalServerError());
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
      "amount": "required"
    };
    await validateMethod(req,  validationRule, res , next);
  } catch (err) {

    return res.json(respondInternalServerError());
  }
};

/**
 * Validate Refund as store credit
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const validateRefundStoreCredit = async (req, res, next) => {

  try {

    console.log(req.body);
    const validationRule = {
      'order_id': "required|integer",
      'line_items': "required|array",
      'line_items.*.id': "required|integer",
      'line_items.*.qty': "required|integer",
      'transactions': "required|array",
      'transactions.*.gateway': "required|string",
      'transactions.*.parent_id': "required|integer",
      'transactions.*.amount': "required|numeric",
    };
    await validator(req.body, validationRule, {}, (err, status) => {
      if (!status) { 
        return res.status(422).json(respondValidationError(err.errors));
      } else {
        next();
      }
    });
  } catch (err) {

    console.log("Error While Validating Refund Req:", err);
    return res.status(500).json(respondInternalServerError());
  }
};

/**
 * Compare received and generated hash to verify the webhook
 * @param req
 * @returns boolean
 */
export const verifyShopifyHook = async (req, res, next) => {

  try {
    console.log(req.headers, "headers");
    const api_secret = process.env.SHOPIFY_API_SECRET ?? "";
   console.log(api_secret , "apisecret");
	 const body = req.rawBody;
    const digest = crypto
      .createHmac("sha256", api_secret)
      .update(body)
      .digest("base64"); 
    const providedHmac = req.headers["x-shopify-hmac-sha256"]?.toString();
   console.log(digest , providedHmac);
    if (digest == providedHmac) {
	console.log("verified");
      next();
    } else {
    res.status(401).json(respondUnauthorized("Unautherised request", {}));
    }
  } catch (e) {
    
    console.log(e);
     res.status(401).json(respondUnauthorized("Unautherised request", {}));
  }
};

/**
 * verify generated hash to verify api
 * 
 * @param {*} req
 * @param {*} res
 */
export const verifyHmacForApi = (req, res) => {

  try {

    const hmac_secret = process.env.HMAC_SECRET ?? "";
    const date = req.headers["timestamp"]?.toString();
    const body = req.body || req.query;
    body["date"] = date;
    const digest = crypto
      .createHmac("sha256", hmac_secret)
      .update(body)
      .digest("hex");
    const providedHmac = req.headers["Authorization"]?.toString();
    if (digest == providedHmac) {

      next();
    } else {

      res.json(respondUnauthorized("not a valid request"));
    }
  } catch (e) {

    res.json(respondInternalServerError());
  }
};
