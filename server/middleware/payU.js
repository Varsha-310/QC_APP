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
  let paymentString = `${process.env.payukey}|${payload.txnid}|${payload.amount}|${payload.productinfo}|${payload.firstname}|${payload.email}|||||||||||${payload.si_details}|${process.env.payusalt}`;
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
    data += `<input  name=${obj} value=${payload[obj]} />`;
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

  return payload;
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
    amount: amount,
    productinfo: "shopifybilling",
    firstname: "varsha",
    email: storeData.email,
    phone: "8095379504",
    lastname: "Antargangi",
    surl: `${process.env.APP_URL}/payment/payu/success`,
    furl: `${process.env.APP_URL}/payment/payu/fail`,
    si: 1,
    si_details:`{"billingAmount":${billingData.billing_amount},"billingCurrency":"INR","billingCycle":${billingData.billing_cycle},"billingInterval":"1","paymentStartDate":${billingData.billing_start_date},"paymentEndDate":"2122-09-01"}`,
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
