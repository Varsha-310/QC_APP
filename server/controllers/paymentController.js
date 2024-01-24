import axios from "axios";
import { createPayment, verifyPayuTranscation } from "../middleware/payU.js";
import { calculateGST } from "./BillingController.js";
import BillingHistory from "../models/BillingHistory.js";
import plan from "../models/plan.js";
import {
  respondWithData,
  respondInternalServerError,
} from "../helper/response.js";
import stores from "../models/store.js";
import store from "../models/store.js";
import { generateCSV } from "./kycController.js";
import payment_template from "../views/payment_completed.js";
import { sendEmail } from "../middleware/sendEmail.js";
import kyc from "../models/kyc.js";

/**
 * create payment
 * @param {*} req
 * @param {*} res
 */
export const create = async (req, res) => {
  try {
    console.log(
      req.token,
      "-----------------creating payment------------------------"
    );
    const store_url = req.token.store_url;
    const storeData = await stores.findOne({ store_url: store_url });
    console.log(storeData);
    const getPlanData = await plan.findOne({ plan_name: req.body.plan_name });
    console.log(getPlanData);

    const currentDate = new Date();
    const currentDay = currentDate.getDate(); // Get the current day of the month

    const monthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const remainingDays = parseInt(monthDays) + 1 - currentDay;
    const dailyRate = getPlanData.price / parseInt(monthDays);
    const calculatedPayment = remainingDays * dailyRate;
    console.log(remainingDays, dailyRate, calculatedPayment);
    let myDate = new Date();
    const date = myDate.toISOString().slice(0, 10);
    const calculatedGst = calculateGST(calculatedPayment);
    console.log(calculatedGst);
    const totalAmount =
      parseFloat(calculatedPayment) + parseFloat(calculatedGst);
    console.log(totalAmount);

    let store = {
      store_url: store_url,
      firstname: storeData.name,
      plan_name: req.body.plan_name,
      lastname: "Test",
      email: storeData.email,
      phone: storeData.phone,
    };
    let billingData = {
      billing_amount: totalAmount,
      billing_start_date: date,
      billing_currency: "INR",
      billing_cycle: "ADHOC",
    };
    let paymentData = createPayment(store, billingData, totalAmount);
    console.log(paymentData, "-----------------------------");

    const tempDate = new Date(),
      y = tempDate.getFullYear(),
      m = tempDate.getMonth(),
      d = tempDate.getDate();
    const billingExp = new Date(y + 10, m, d);
    await BillingHistory.updateOne(
      {
        store_url: store_url,
        status: "PENDING",
      },
      {
        id: `BL${Date.now() + Math.random().toString(10).slice(2, 8)}`,
        store_url: store_url,
        given_credit: getPlanData.plan_limit,
        montly_charge: getPlanData.price,
        monthly_gst: calculatedGst,
        usage_charge: getPlanData.usage_charge,
        planName: getPlanData.plan_name,
        usage_limit: getPlanData.usage_limit,
        transaction_id: paymentData.txnid,
        upfront_amount: calculatedPayment,
        invoiceAmount: totalAmount,
        planEndDate: billingExp,
        marchant_name: storeData.name,
        store_id: storeData.shopify_id,
      },
      { upsert: true }
    );

    res.json({
      ...respondWithData("payment URL"),
      data: { payload: paymentData, url: process.env.payupaymenturl, days : remainingDays },
    });
  } catch (err) {
    console.log(err);
    res.json(respondInternalServerError());
  }
};

/**
 * checking the success response of transaction
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const payuPayment = async (req, res) => {
  let reqData = req.body;
  console.log(reqData, "-----------------request data--------------------");
  if (reqData.status == "success") {
    await updateBillingHistory(reqData);
  }
  return res.redirect(`${process.env.CLIENT_URL}kyc-status`);
};

/**
 * failure url for payu transaction
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const failurePayment = async (req, res) => {
  return res.redirect(`${process.env.CLIENT_URL}payment-unsuccessful`);
};

/**
 * updating billing history after successful transaction
 * @param {*} data
 * @returns
 */
const updateBillingHistory = async (data) => {
  const issue_date = new Date();

  let month = issue_date.toLocaleString("default", {
    month: "long",
  });

  let year = issue_date.getFullYear();

  await BillingHistory.updateMany(
    { store_url: data.productinfo, status: "ACTIVE" },
    { status: "UPGRADED" }
  );
  const updateBilling = await BillingHistory.updateOne(
    { transaction_id: data.txnid },
    {
      status: "ACTIVE",
      issue_date: issue_date,
      billingDate: issue_date,
    },
    { upsert: true }
  );
  console.log(updateBilling);
  await store.updateOne(
    { store_url: data.productinfo },
    { $set: { "plan.plan_name": data.lastname } }
  );
  const billingData = await BillingHistory.findOne({
    transaction_id: data.txnid,
  });
  await store.findOneAndUpdate({ email: data.email }, { mandate: data });
  const storeDetails = await store.findOne({ store_url: data.productinfo });
  const getBilling = await BillingHistory.findOne({
    transaction_id: data.txnid,
  });
  const amount = parseFloat(getBilling.invoiceAmount.toFixed(2));
  let email_template = payment_template;
  email_template = email_template.replace("__merchant__", storeDetails.name);
  email_template = email_template.replace("__plan_name__", data.lastname);
  email_template = email_template.replace(
    "__plan_amount__",
    getBilling.montly_charge
  );
  email_template = email_template.replace(
    "__given_credit__",
    getBilling.given_credit
  );
  email_template = email_template.replace(
    "__usage_charge__",
    getBilling.usage_charge
  );
  email_template = email_template.replace(
    "__usage_limit__",
    getBilling.usage_limit
  );
  email_template = email_template.replaceAll(
    "__base_amount__",
    amount
  );
  email_template = email_template.replaceAll("__billing_id__", billingData.id);
  email_template = email_template.replace("__month__", month);
  email_template = email_template.replace("__year__", year);

  const options = {
    to: data.email,
    from: "merchantalerts@qwikcilver.com",
    subject: "PAYMENT COMPLETED ",
    html: email_template,
  };
  await sendEmail(options);
  await kyc.updateOne(
    { store_url: data.productinfo },
    {
      subscription_payment: true,
      payu_txn_id: data.txnid,
      payu_mihpayid: data.mihpayid,
      package_details: data.lastname,
      billing_id: billingData.id,
    }
  );
  await generateCSV(data.productinfo);
  await store.updateOne(
    { store_url: data.productinfo },
    { is_plan_done: true, is_payment_done: true }
  );
  return 1;
};
