import Jwt from "jsonwebtoken";
import Store from "../models/store.js";
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
