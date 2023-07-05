import axios from "axios";
import {
  respondInternalServerError,
  respondWithData,
} from "../helper/response";
import CryptoJS from "crypto-js";
import { logger } from "../helper/utility";
import store from "../models/store";

/**
 * Method to initiate kyc
 * @param {*} req
 * @param {*} res
 */
export const initiatieKyc = async (req, res) => {
  try {
    let storeUrl = req.token.store_url;
    let storeData = await store.findOne({store_url : storeUrl});
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
          phone : "987654321"
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
          let storeDetails =await store.updateOne(
            { store_url: storeUrl },
            { status: "kYC initiated"},
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
    console.log(err)
    res.json(
      respondInternalServerError()
    );
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
        mobile : "987654321",
        queryParam: "asdfghjkl"
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


export const statusKyc = (req,res) => {
  try{
   const  checkStatus = store.findOne({ store_url :  req.token.store_url});
   res.json({
    ...respondWithData("store status"),
    data: checkStatus.status
  });
  }
  catch(err){
    console.log(err);
    res.json(
      respondInternalServerError()
    );
  }

}