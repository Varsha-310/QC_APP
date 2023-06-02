import * as Validator from "validatorjs";
import { respondInternalServerError, respondUnauthorized } from "./response";

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
 * Validation for API
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const validateApi = async (req, res, next) => {
  try {
    const validationRule = {
      name: "required|string",
    };
    await validateMethod(req, res, next, validationRule);
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
const validateMethod = async (req, validationRule, next) => {
  try {
    await validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.send(err);
      } else {
        next();
      }
    });
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * Compare received and generated hash to verify the webhook
 * @param req
 * @returns boolean
 */
export const verifyShopifyHook = async (req, res, next) => {
  try {
    const api_secret = process.env.SHOPIFY_API_SECRET ?? "";
    const body = req.rawBody;
    const digest = crypto
      .createHmac("sha256", api_secret)
      .update(body)
      .digest("base64");
    const providedHmac = req.headers["x-shopify-hmac-sha256"]?.toString();

    if (digest == providedHmac) {
      next();
    } else {
      res.json(respondUnauthorized("not shopify webhook"));
    }
  } catch (e) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
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
    const providedHmac = req.headers[""]?.toString();

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
