import axios from "axios";
import {
  respondInternalServerError,
  respondWithData,
} from "../helper/response.js";
import CryptoJS from "crypto-js";
import { logger } from "../helper/utility.js";
import kycs from "../models/kyc.js";
import store from "../models/store.js";
import { parse } from "json2csv";
import fs from "fs"
import orders from "../models/orders.js";

/**
 * Method to initiate kyc
 * @param {*} req
 * @param {*} res
 */
export const initiatieKyc = async (req, res) => {
  try {
    let storeUrl = req.token.store_url;
    let storeData = await store.findOne({ store_url: storeUrl });
    let time = Date.now().toString();
    let orgId = process.env.KYC_ORG_KEY;
    let securekey = process.env.MANCH_SECURE_KEY;
    logger.info("kyc transaction requested for");
    const transactionData = {
      method: "POST",
      url: `${process.env.KYC_BASE_URL}/app/api/fill-data/transaction`,
      headers: {
        "Content-Type": "application/vnd.manch.v1+json",
        "request-id": time,
        Authorization:
          "HS256" +
          " " +
          orgId +
          ":" +
          CryptoJS.HmacSHA256(orgId + time, securekey),
      },
      data: JSON.stringify({
        companyKey: process.env.COMPANY_KEY,
        templateKey: process.env.TEMPLATE_KEY,
        expiresInDays: "30",
        createdForEmail: process.env.CREATED_FOR_EMAIL,
        createdByEmail: process.env.CREATED_BY_EMAIL,
        title: "e-KYC process",
        message: "Please fill the details and submit",
        secondPartyDetails: {
          name: storeData.name,
          email: storeData.email,
          phone: storeData.phone || "null" 
        },
      }),
    };
    console.log(transactionData);
    let result = await axios(transactionData);
    if (result.status == "200" && result.data.transactionId) {
      let docFillUrls = result.data.docFillUrls;
      let txnId = result.data.transactionId;
      const keys = Object.keys(docFillUrls);
      const dynamicKey = keys.find((key, index) => index === 0);
      const formUrl = docFillUrls[dynamicKey];
      console.log(formUrl);

      let formresult = await fillForm(formUrl, storeData);
      if (formresult.status == 200 && formresult.data.status == "SUCCESS") {
        let dispatchResponse = await dispatchTransaction(txnId);
        console.log(dispatchResponse);
        if (
          dispatchResponse.status == "200" &&
          dispatchResponse.data.status == "SUCCESS"
        ) {
          let storeDetails = await store.updateOne(
            { store_url: storeUrl },
            { status: "kYC initiated" },
            { upsert: true }
          );
          res.json({
            ...respondWithData("KYC URL"),
            data: dispatchResponse.data.signURL,
          });
        }
      }
    }
  } catch (err) {
    logger.info(err);
    console.log(err);
    res.json(respondInternalServerError());
  }
};

/**
 * Method to submit the form filled
 * @param {*} data
 * @param {*} res
 */
export const fillForm = async (formUrl, shop) => {
  try {
    let time = Date.now().toString();
    let orgId = process.env.KYC_ORG_KEY;
    let securekey = process.env.MANCH_SECURE_KEY;
    // logger.info("form fill api called for", transaction_id);
    const formData = {
      method: "PUT",
      url: formUrl,
      headers: {
        "Content-Type": "application/vnd.manch.v1+json",
        "request-id": time,
        Authorization:
          "HS256" +
          " " +
          orgId +
          ":" +
          CryptoJS.HmacSHA256(orgId + time, securekey),
      },
      data: JSON.stringify({
        shopifyID: shop.shopify_id,
        firstName: shop.name,
        lastName: "qwertyu",
        mobile: shop.phone,
        queryParam: "asdfghjkl",
      }),
    };
    let result = await axios(formData);
    return result;
  } catch (err) {
    console.log(err);
    logger.info(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};

/**
 * To dispatch the transaction to user
 * @param {*} data
 * @param {*} res
 */
export const dispatchTransaction = async (txnId) => {
  try {
    let time = Date.now().toString();
    let orgId = process.env.KYC_ORG_KEY;
    let securekey = process.env.MANCH_SECURE_KEY;

    logger.info("dispatch api called for", txnId);
    const dispatchData = {
      method: "PATCH",
      url: `${process.env.KYC_BASE_URL}/app/api/fill-data/transaction/${txnId}`,
      headers: {
        "Content-Type": "application/vnd.manch.v1+json",
        "request-id": time,
        Authorization:
          "HS256" +
          " " +
          orgId +
          ":" +
          CryptoJS.HmacSHA256(orgId + time, securekey),
      },
      data: JSON.stringify({
        action: "SENT_TO_SECOND_PARTY",
      }),
    };
    let result = await axios(dispatchData);
    console.log(dispatchData);
    return result;
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
};

export const statusKyc = async (req, res) => {
  try {
    let stores = req.token.store_url;
    console.log(stores);
    const checkStatus = await store.findOne({ store_url: stores });
    console.log(checkStatus);
    res.json({
      ...respondWithData("Merchant status"),
      data: {
        kyc: checkStatus.is_kyc_done,
        plan: checkStatus.is_plan_done,
        payment: checkStatus.is_payment_done,
        email:checkStatus.email,
        name: checkStatus.name
      }
    });
  } catch (err) {
    console.log(err);
    res.json(respondInternalServerError());
  }
};


export const kycDetails = async(req,res) => {
  console.log(req.body);
  logger.info(req.body , "kyc webhook for merchant details");
  const selectedFields = ['merchant_data'];

  const documentsCursor = await kycs.find();
  console.log(documentsCursor)
    // Convert documents to CSV
    const csvData = parse(documentsCursor , { fields: selectedFields });
    console.log(csvData)

    // Write CSV data to a file
    fs.writeFileSync('mongodb_data.csv', csvData, 'utf8');  

}