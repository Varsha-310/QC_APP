import axios from "axios";
// import storeBilling from "../models/storeBilling";
import crypto from "crypto";

/**
 * function to create hash
 * @param {*} payload 
 * @returns 
 */
const generateHash = (payload) => {
  console.log("-----------------payload---------------------------",payload.si_details);
  let paymentString = `${payload.key}|${payload.txnid}|${payload.amount}|${payload.productinfo}|${payload.firstname}|${payload.email}|||||||||||{"billingAmount":"399.00","billingCurrency":"INR","billingCycle":"MONTHLY","billingInterval":"1","paymentStartDate":"2023-09-01","paymentEndDate":"2025-09-01"}|${process.env.payusalt}`;
  console.log(paymentString, "payment string");
  const hash = crypto.createHash("sha512");
  hash.update(paymentString, "utf-8");
  return hash.digest("hex");
};

/**
 * function submit payment form to payU
 * @param {*} payload 
 * @returns 
 */
const generateHtml = (payload) => {
  console.log(process.env.payupaymenturl);
  let data = `<form action=${process.env.payupaymenturl} method="POST">`;
  for (let obj in payload)
    data += `<input type="hidden" name=${obj} value=${payload[obj]} />`;
  data += '<input type="submit" />';
  return data;

};


/**
 * creating payment
 * @param {*} storeData 
 * @param {*} billingData 
 * @param {*} amount 
 * @returns 
 */
export const createPayment = (storeData, billingData, amount) => {
  let payload = createPayload(storeData, billingData, amount);
  console.log(payload);
  let hash = generateHash(payload);
  payload.hash = hash;
  let generatedHtml = generateHtml(payload);
  return [generatedHtml, payload];
};


/**
 * creating payload for submitting the form
 * @param {*} storeData 
 * @param {*} billingData 
 * @param {*} amount 
 * @returns 
 */
const createPayload = (storeData, billingData, amount) => {
  let payload = {
    key: process.env.payukey,
    api_version: 7,
    txnid: Math.random().toString(36),
    amount: 399,
    productinfo: "shopifybilling",
    firstname: "varsha",
    email: "varshaa@marmeto.com",
    phone: 8095379504,
    lastname: "Antargangi",
    surl: `https://19bb-106-51-87-194.ngrok-free.app/payment/payu/success`,
    furl: `https://19bb-106-51-87-194.ngrok-free.app/payment/payu/fail`,
    si: 1,
    si_details:'{"billingAmount":"399.00","billingCurrency":"INR","billingCycle":"MONTHLY","billingInterval":"1","paymentStartDate":"2023-09-01","paymentEndDate":"2025-09-01"}',
  };
  return payload;
};

/**
 * method to verify payU transaction
 * @param {*} transId 
 */
export const verifyPayuTranscation = async (transId) => {
  
  const paymentString = `${process.env.payukey}|verify_payment|0.12w.sdq.hnj890okjhg|${process.env.payusalt}`;
  console.log(paymentString, "payment string");
  const hash = crypto.createHash("sha512");
  hash.update(paymentString, "utf-8");
  const hashed = hash.digest("hex");

  const url = "https://test.payu.in/merchant/postservice?form=2";
  const headers = {
    "accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = new URLSearchParams();
  data.append("key", process.env.payukey);
  data.append("command", "verify_payment");
  data.append("var1", "0.12w.sdq.hnj890okjhg");
  data.append("hash", hashed);

  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
};
