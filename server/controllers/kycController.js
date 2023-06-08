import axios from "axios";
import { respondInternalServerError } from "../helper/response";
import crypto from "crypto";
import { logger } from "../helper/utility";

/**
 * Method to initiate kyc
 * @param {*} req
 * @param {*} res
 */
export const initiatieKyc = async (req, res) => {
  try {
    let key = process.env.MANCH_SECURE_KEY;
    let message = "Please fill the details and submit";
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(message);
    const hmacDigest = hmac.digest("hex");
    console.log(hmacDigest, "hmac for kyc auth");

    const { email, phone, store, name } = req.body;
    logger.info("kyc transaction requested for", email, store);
    const transactionData = {
      method: "POST",
      url: `${process.env.KYC_BASE_URL}/app/api/fill-data/transaction`,
      headers: {
        "Content-Type": "application / vnd.manch.v1 + json",
        "request-id": "2wdc4rtg6yuj",
        authorization: hmacDigest,
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
          organization: store,
          name: name,
          email: email,
          phone: phone,
        },
      }),
    };
    const result = await axios(transactionData);
    console.log(result);
  } catch (err) {
    console.log(err);
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
export const fillForm = (data, res) => {
  try {
    let { transaction_id, template_id, doctype_id } = data;
    logger.info("form fill api called for", transaction_id);
    const formData = {
      method: "PUT",
      url: `${process.env.KYC_BASE_URL}/app/fill-data/transaction/${transaction_id}/template/${template_id}/docType/${doctype_id}`,
      headers: {
        "Content-Type": application / vnd.manch.v1 + json,
      },
      data: JSON.stringify({}),
    };
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
export const dispatchTransaction = (data, res) => {
  try {
    
    let { transaction_id } = data;
    logger.info("dispatch api called for", transaction_id);
    const dispatchData = {
      method: "PATCH",
      url: `${process.env.KYC_BASE_URL}//fill-data/transaction/${transaction_id}`,
      headers: {
        "Content-Type": application / vnd.manch.v1 + json,
      },
      data: JSON.stringify({
        action: "SENT_TO_SECOND_PARTY",
      }),
    };
  } catch (err) {
    console.log(err);
    logger.info(err);
    res.json(
      respondInternalServerError("Something went wrong try after sometime")
    );
  }
};
