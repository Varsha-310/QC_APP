import axios from "axios";
import store from "../models/store.js";
import {
  respondInternalServerError,
  respondNotAcceptable,
  respondSuccess,
} from "../helper/response.js";
import cookie from "cookie";
import crypto from "crypto";
import { checkWebhooks } from "../helper/custom.js";
import { createJwt } from "../helper/jwtHelper.js";
import refundSetting from "../models/refundSetting.js";
import Jwt from "jsonwebtoken";


/**
 * Method for installation method
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const install = async (req, res) => {
  try {
    const shop = req.query.shop;
    if (shop) {
      const scopes = process.env.SCOPES;
      const apiKey = process.env.SHOPIFY_API_KEY;
      const APP_URL = process.env.APP_URL;
      const state = Date.now();
      const redirectUri = `${APP_URL}/shopify/callback`;
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;
      res.cookie("state", state); // cookie: 'state=1686118763459',
      return res.redirect(installUrl);
    } else {
      res.json(respondNotAcceptable("Something went wrong try after sometime"));
    }
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * Method for installation callback
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const installCallback = async (req, res) => {
  try {
    const { shop, hmac, code, state } = req.query;
    const apiSecret = process.env.SHOPIFY_API_SECRET ?? "";
    const CLIENT_URL = process.env.CLIENT_URL ?? "";
    const headersCookies = req.headers.cookie ?? "";
    const stateCookie = cookie.parse(headersCookies).state;
    if (state !== stateCookie) {
      return res.status(403).send("Request origin cannot be verified");
    }
    if (shop && hmac && code) {
      const query = req.query;
      delete query["signature"];
      delete query["hmac"];
      const message = new URLSearchParams(query).toString();
      const providedHmac = Buffer.from(hmac.toString(), "utf-8");
      const generatedHash = Buffer.from(
        crypto.createHmac("sha256", apiSecret).update(message).digest("hex"),
        "utf-8"
      );
      let hashEquals = false;
      console.log(generatedHash, providedHmac);
      try {
        hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
      } catch (e) {
        hashEquals = false;
      }

      if (!hashEquals) {
      }
      const storeStatus = await store.findOne({ store_url: shop });
      let token = await createJwt(shop);
      let accessToken = await getAccessToken(shop, code, res);

      if (storeStatus && storeStatus.is_installed == true) {

        await store.updateOne({store_url : shop} , {auth_token : token, access_token: accessToken});
        return res.redirect(`${CLIENT_URL}?store=${shop}&token=${token}`);
      } else {
      
        // console.log(accessToken, "accessToken");
        let storeData = await getShopifyStoreData(shop, accessToken);
        if (storeData) {
          let response = await saveStoreData(storeData, shop, accessToken, token);
          // console.log(response ,"response of store data");
          await checkWebhooks(shop, accessToken);
          return res.redirect(`${CLIENT_URL}?store=${shop}&token=${token}`);
        }
      }
    } else {
      res.json(respondNotAcceptable());
    }
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * Method to save store details in DB
 * @param {*} shopData
 * @param {*} shop
 * @param {*} accessToken
 * @returns
 */
export const saveStoreData = async (shopData, shop, accessToken, token) => {
  try {
  
    const data = {
      shopify_id: shopData.shop.id,
      name: shopData.shop.name,
      email: shopData.shop.email,
      phone: shopData.shop.phone,
      store_url: shop.toString(),
      access_token: accessToken,
      status: "installed",
      country_code: shopData.shop?.country_code.toLowerCase(),
      is_installed: true,
      auth_token : token
    };
    console.log(data);
    let storeDetails = await store.updateOne(
      { store_url: data.store_url },
      { $set: data },
      { upsert: true }
    );
    await refundSetting.updateOne({store_url: shop.toString()},{store_url: shop.toString()}, {upsert:true});
    console.log( storeDetails, "---------------------saved to db------------------");
    return true;
  } catch (error) {
    console.log(error);
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * Method to get store details
 * @param {*} shop
 * @param {*} accessToken
 * @returns
 */
export const getShopifyStoreData = async (shop, accessToken) => {
  try {
    let API_VERSION = process.env.API_VERSION;
    const shopOption = {
      method: "GET",
      url: `https://${shop}/admin/api/${API_VERSION}/shop.json?fields=name,id,email,city,country_code`,
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    };
    let shopData = await axios(shopOption);
    console.log(shopData.data, "shopData");

    shopData =
      shopData.status == 200 || shopData.status == 201 ? shopData.data : false;
    console.log("----------------------------", shopData);
    return shopData;
  } catch (error) {
    res.json(respondInternalServerError());
  }
};

/**
 * Method to get access token of stores
 * @param {*} shop
 * @param {*} code
 * @returns
 */
export const getAccessToken = async (shop, code, res) => {
  try {
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiSecret = process.env.SHOPIFY_API_SECRET;
    const options = {
      method: "POST",
      url: `https://${shop}/admin/oauth/access_token`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        client_id: apiKey,
        client_secret: apiSecret,
        code: code,
      },
    };
    console.log(options, "access token");
    let accessToken = await axios(options);

    accessToken =
      accessToken.status == 200 || accessToken.status == 201
        ? accessToken.data.access_token
        : false;

    return accessToken;
  } catch (error) {
    res.json(
      respondInternalServerError()
    );
  }
};

/**
 * Method for appUninstalled method
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const appUninstalled = async (req, res) => {
  const { domain } = req.body;
  await store.findOneAndUpdate({ store_url: domain }, { isInstalled: false });
  res.json(respondSuccess("webhook received"));
};

/**
 * Logout method
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const logoutSession = async (req, res)=>{

  try {
    
    await store.updateOne({store_url : req.token.store_url} , {auth_token : ""});
    return res.json(respondSuccess("Successfully Logout"));
  } catch (error) {
    
    console.log("Logout Error,",error);
    return res.json(respondInternalServerError());
  }
}