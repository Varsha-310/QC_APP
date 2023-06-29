import axios from "axios";
import { respondInternalServerError, respondSuccess, respondWithData } from "../helper/response";
// import crypto from "crypto";
import CryptoJS from "crypto-js";
import { logger } from "../helper/utility";
import plan from "../models/plan";
/**
 * Method to initiate kyc
 * @param {*} req
 * @param {*} res
 */
export const initiatieKyc = async (req, res) => {
  try {
    let time = Date.now().toString();
    let orgId = process.env.KYC_ORG_KEY
    let securekey = process.env.MANCH_SECURE_KEY;
    logger.info("kyc transaction requested for");
    const transactionData = {
      method: "POST",
      url: `${process.env.KYC_BASE_URL}/app/api/fill-data/transaction`,
      headers: {
        "Content-Type": "application/vnd.manch.v1+json",
        "request-id": time,
        "Authorization": "HS256"+ " " + orgId + ":" + CryptoJS.HmacSHA256(orgId + time, securekey),
       
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
          organization: "tetsing",
          name: "varsha",
          email: "varshaa@test.com",
          phone: "123456789",
        },
      }),
    };
    console.log(transactionData)
     let result =await axios(transactionData)
 
    console.log("result +++++++++++++++++++++++++++++++++++++++",result);
if(result.status == "200" && result.data.transactionId){
  let docFillUrls = result.data.docFillUrls;
  let txnId = result.data.transactionId;
  const keys = Object.keys(docFillUrls);
  const dynamicKey = keys.find((key, index) => index === 0);
  const formUrl = docFillUrls[dynamicKey];
  console.log(formUrl);
  
  let formresult = await fillForm(formUrl);
  console.log(formresult, "------------------");
  if(formresult.status == 200 && formresult.data.status == "SUCCESS"){
    let dispatchResponse = await dispatchTransaction(txnId);
    console.log(dispatchResponse);
    if(dispatchResponse.status == "200" && dispatchResponse.data.status == "SUCCESS"){
      res.json({
        ...respondWithData("KYC URL"),
        data: dispatchResponse.data.signURL
      });
    }
  }
  
}

  } catch (err) {
    console.log("err--------------------------------------",err);
    logger.info(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};


/**
 * Method to submit the form filled
 * @param {*} data
 * @param {*} res
 */
export const fillForm = async(formUrl) => {
  try {
    let time = Date.now().toString();
    let orgId = process.env.KYC_ORG_KEY
    let securekey = process.env.MANCH_SECURE_KEY;
    // logger.info("form fill api called for", transaction_id);
    const formData = {
      method: "PUT",
      url : formUrl,
      headers: {
        "Content-Type": "application/vnd.manch.v1+json",
        "request-id": time,
        "Authorization": "HS256"+ " " + orgId + ":" + CryptoJS.HmacSHA256(orgId + time, securekey),
      },
      data: JSON.stringify({
        "shopifyID":"SHOP256",
        "pan":"AYDPK1509P",
        "firstName":"varsha",
        "lastName":"Antargangi"
      }),
    };
    let result =await axios(formData)
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
    let orgId = process.env.KYC_ORG_KEY
    let securekey = process.env.MANCH_SECURE_KEY;

    logger.info("dispatch api called for", txnId);
    const dispatchData = {
      method: "PATCH",
      url: `${process.env.KYC_BASE_URL}/app/api/fill-data/transaction/${txnId}`,
      headers: {
        "Content-Type": "application/vnd.manch.v1+json",
        "request-id": time,
        "Authorization": "HS256"+ " " + orgId + ":" + CryptoJS.HmacSHA256(orgId + time, securekey)
      },
      data: JSON.stringify({
        action: "SENT_TO_SECOND_PARTY",
      }),
    };
    let result = await axios(dispatchData);
    console.log(dispatchData)
  return result;
  } catch (err) {
    console.log(err);
    logger.info(err);
    
  }
};

