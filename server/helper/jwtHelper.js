import { Jwt } from "jsonwebtoken";
import store from "../models/store";
import { respondInternalServerError, respondUnauthorized } from "./response";

/**
 * create jwt token for api authorization
 * @param {*} req
 * @param {*} res
 */
export const createJwt = async (req, res) => {
  try {
    let { store_url } = req.body;
    let secretKey = process.env.JWT_SECRET;
    const storeData = await store.find({ store_url: store_url });
    let data = storeData.store_url;
    Jwt.sign(data, secretKey, (err, token) => {
      if (err) {
        res.json(
          respondInternalServerError("Something went wrong try after sometime")
        );
      } else {
        res.json({ token });
      }
    });
  } catch (err) {
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * verify jwt token for api authorization
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
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};
