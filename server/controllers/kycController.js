import axios from "axios";
import {
  respondInternalServerError,
  respondWithData,
  respondSuccess,
} from "../helper/response.js";
import CryptoJS from "crypto-js";
import { logger } from "../helper/utility.js";
import kycs from "../models/kyc.js";
import store from "../models/store.js";
import NodeMailer from "nodemailer";
import kyc from "../models/kyc.js";
import { sendEmail } from "../middleware/sendEmail.js";
import qcCredentials from "../models/qcCredentials.js";

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
          phone: storeData.phone || "null",
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

      let formresult = await fillForm(
        formUrl,
        storeData,
        req.headers.authorization
      );
      if (formresult.status == 200 && formresult.data.status == "SUCCESS") {
        let dispatchResponse = await dispatchTransaction(txnId);
        console.log(dispatchResponse);
        if (
          dispatchResponse.status == "200" &&
          dispatchResponse.data.status == "SUCCESS"
        ) {
          let storeDetails = await store.updateOne(
            { store_url: storeUrl },
            { status: "kYC initiated" , shopify_id : storeData.shopify_id },
            { upsert: true }
          );
          const updateKyc = await kyc.updateOne({store_url :storeUrl}, {status: "INITIATED" , transaction_id: txnId, shopify_id :storeData.shopify_id}, {upsert:true});
         // await qcCredentials.updateOne({shopify_id :data.formFillData.shopifyID},{store_url :storeUrl}, {upsert: true});

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
export const fillForm = async (formUrl, shop, token) => {
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
        email: shop.email,
        mobile: shop.phone,
        queryParam: token,
      }),
    };
    let result = await axios(formData);
    return result;
  } catch (err) {
    console.log(err);
    logger.info(err);
    res.json(
      respondInternalServerError()
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
/**
 * to check merchant kyc status
 * @param {*} req 
 * @param {*} res 
 */

export const statusKyc = async (req, res) => {
  try {
    console.log("---------kyc---------------", req.body);
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
        email: checkStatus.email,
        name: checkStatus.name,
        dashboard_activated: checkStatus.dashboard_activated
      },
    });
  } catch (err) {
    console.log(err);
    res.json(respondInternalServerError());
  }
};

/**
 * to process data received over webhook from manch
 * @param {*} req 
 * @param {*} res 
 */
export const kycDetails = async (req, res) => {
  logger.info("----------------kyc webhook----------------", req.body);

  console.log("----------------kyc webhook----------------", req.body);
  const data = req.body.data;
  logger.info(req.body, "kyc webhook for merchant details");
  console.log("------------------------------------------------", data.formFillData.pan)

  const kycData = await kycs.updateOne({shopify_id :data.formFillData.shopifyID}, {$set:{
        "merchant_name": data.formFillData.gstinName,
        "merchant_created_at": "",
        "outlet": data.formFillData.outlet ,
        "gstin": data.formFillData.gstin,
        "address_line1":data.formFillData.address_line1,
        "address_line2":data.formFillData.address_line2,
        "area" :data.formFillData.area,
        "city":data.formFillData.city,
        "state":data.formFillData.state,
        "pincode":data.formFillData.pincode,
        "contact_first_name": data.formFillData.first_name,
        "contact_last_name":data.formFillData.last_name,
        "email":data.formFillData.email,
        "phone":data.formFillData.phone,
        "PAN":data.formFillData.pan,
        "panName": data.formFillData.panName,
        "type_of_organization" : data.formFillData.typeofOrganization,
        "category":data.formFillData.category,
        "cin_number": data.formFillData.cinNo,
        "cin_name":data.formFillData.cinllpName,
        "gstin_name": data.formFillData.gstinName,
        
      },
  }, {upsert: true}
  );
  await store.updateOne({shopify_id :data.formFillData.shopifyID}, {is_kyc_done : true});

  res.json(respondSuccess("webhook received"));
};

/**
 * to genearte csv of merchant Data
 */
export const generateCSV = async (store) => {
  const kycData = await kycs.findOne({store_url: store});
  console.log(kycData);
  const {
    shopify_id,
    transaction_id,
    merhchant_created_at,
    merchant_name,
    gstin,
    address_line1,
    address_line2,
    area,
    city,
    state,
    pincode,
    contact_first_name,
    contact_last_name,
    email,
    phone,
    PAN,
    package_details,
    subscription_payment,
    cin_number,
    payu_txn_id,
    payu_mihpayid,
    billing_id
   
  } = kycData;
console.log(kycData.gstin)
  const headers = [
    "shopify_id",
    "transaction_id",
    "merhchant_created_at",
    "merchant_name",
    "gstin",
    "address_line1",
    "address_line2",
    "area",
    "city",
    "state",
    "pincode",
    "contact_first_name",
    "contact_last_name",
    "email",
    "phone",
    "PAN",
    "package_details",
    "subscription_payment",
    "cin_number",
    "payu_txn_id",
    "payu_mihpayid",
    "billing_id"
   
  ];
  const values = [
    shopify_id,
    transaction_id,
    merhchant_created_at,
    merchant_name,
    gstin,
    address_line1,
    address_line2,
    area,
    city,
    state,
    pincode,
    contact_first_name,
    contact_last_name,
    email,
    phone,
    PAN,
    package_details,
    subscription_payment,
    cin_number,
    payu_txn_id,
    payu_mihpayid,
    billing_id
  ];

  const csv = headers.join(", ") + "\n" + values.join(",");
 console.log(csv)
  const options = {
    from: "ShopifyKYC@qwikcilver.com",
   to: "qc.serviceautomation_testing@qwikcilver.com",
   
    subject: "KYC details of Merchant",
    attachments: [
      {
        filename: `KYC-${store}.csv`,
        content: csv, // attaching csv in the content
      },
    ],
  };
   console.log(options);
   await sendEmail(options);
   return true;
};
