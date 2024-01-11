import Jwt from "jsonwebtoken";
import Store from "../models/store.js";
import { errorMsg, respondError, respondInternalServerError, respondUnauthorized } from "./response.js";

/**
 * Verify Refund API
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const verifyRefundAPI = async(req, res, next) => {

  try {

    console.log(" ----- Verification Request Started -----");
    //check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json(respondError("Missing Authorization Header", 401));
    }

    console.log("Request Headers: ", req.headers.authorization);
    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    console.log("Credentials:", username, password );
    const storeExists = await Store.findOne({
      store_url: username,
      api_auth: password
    });
    if (storeExists) {

      req.token ={ store_url: username };
      return next();
    }else {

      return res.status(401).json(respondError("Invalid Authentication Credentials", 401));
    }
  } catch (err) {

    console.log("Error While Validating Ext Refund API", err);
    return res.status(500).json(respondInternalServerError());
  }
}

/**
 * Create jwt token for api authorization
 * @param {*} req
 * @param {*} res
 */
export const createJwt = async (shop) => {

  console.log("create jwt start");
  try {

    let secretKey = process.env.JWT_SECRET;
    let payload = { store_url: shop };
    console.log("----payload--------", payload);
    return Jwt.sign(payload, secretKey, {expiresIn: "1d"});
  } catch (err) {

    console.log(err)
    console.log("Error in JWT helper tokem");
    return false;
  }
};

/**
 * Verify jwt token for api authorization
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const verifyJwt = (req, res, next) => {

  try {
    console.log("-----in verify jwt----------", req.headers);
    if (req.headers.authorization) {
      Jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET,
        async function (err, payload) {
          if (!err) {
            req.token = payload;
            console.log(payload , "payload")
            let storeExists = await Store.findOne({
              auth_token: req.headers.authorization
            });
            if (storeExists) {
             
              next();
            } else {
              console.log(err);
              res.json(respondUnauthorized("Invalid jwt token"));
            }
          } else {
            console.log(err);
            res.json(respondUnauthorized("Invalid jwt token"));
          }
        }
      );
    } else {
      res.json(respondUnauthorized("Invalid jwt token"));
    }
  } catch (err) {
    console.log("asdfghjkl;", err);
    res.json(respondInternalServerError());
  }
};
