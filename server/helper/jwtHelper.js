import  Jwt  from "jsonwebtoken";
import store from "../models/store.js";
import { respondInternalServerError, respondUnauthorized } from "./response.js";

/**
 * Create jwt token for api authorization
 * @param {*} req
 * @param {*} res
 */
export const createJwt = async (shop) => {
  console.log("create jwt start");
  try {
    
    let secretKey = process.env.JWT_SECRET;
    const storeData = await store.find({ store_url: shop });
    let payload = {store_url : storeData.store_url};
    let jwtToken = await Jwt.sign(payload, secretKey)
    console.log("JWT TOken TEst");
    return jwtToken;
  } catch (err) {
    // console.log(err)
    console.log("Error in JWT helper tokem");
    return false;
    // res.json(

    //   respondInternalServerError("Something went wrong try after sometime")
    // );
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
    if (req.headers.authorization) {
      Jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET,
        function (err, payload) {
          if (!err) {
            req.token = payload;
            next();
          } else {
            res.json(respondUnauthorized("Invalid jwt token"));
          }
        }
      );
    } else {
      res.json(respondUnauthorized("Invalid jwt token"));
    }
  } catch (err) {
    console.log("asdfghjkl;", err)
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};
