import  jwt  from "jsonwebtoken";
import store from "../models/store";
import { respondInternalServerError, respondUnauthorized } from "./response";

/**
 * Create jwt token for api authorization
 * @param {*} req
 * @param {*} res
 */
export const createJwt = async (shop) => {

  console.log("create jwt start");
  try {

    let secretKey = process.env.JWT_SECRET;
    return jwt.sign({store_url: shop}, secretKey)
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
    if (req.headers.authorization) {
      jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET,
        function (err, payload) {
          if (!err) {
            req.token = payload;
            // console.log(req.token)
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
