import axios from "axios";
import { createPayment, verifyPayuTranscation } from "../middleware/payU.js";
import { calculateGST } from "./BillingController.js";
import BillingHistory from "../models/BillingHistory.js";
import plan from "../models/plan.js";
import { logger } from "../helper/utility.js";
import { respondWithData, respondInternalServerError } from "../helper/response.js";
import stores from "../models/store.js";
import store from "../models/store.js";


/**
 * create payment
 * @param {*} req
 * @param {*} res
 */
export const create = async (req, res) => {
  try {
    console.log("-----------------creating payment------------------------");
    // const store_url = req.token.store_url
    const store_url = "qc-plus-store.myshopify.com";
    const storeData = await stores.findOne({ store_url: store_url});
    console.log(storeData)
    const getPlanData = await plan.findOne({plan_name : storeData.plan.plan_name});
    console.log(getPlanData)
    const currentDate = new Date();
    const currentDay = currentDate.getDate(); // Get the current day of the month
    const remainingDays = 30 - currentDay;
    const dailyRate = getPlanData.price / 30;
    const calculatedPayment = remainingDays * dailyRate;
    console.log(remainingDays,dailyRate,calculatedPayment)
    let myDate = new Date();
    const date = ((myDate).toISOString().slice(0, 10));
    const calculatedGst = calculateGST(calculatedPayment);
    console.log(calculatedGst)
     const totalAmount = (parseFloat(calculatedPayment) + parseFloat(calculatedGst));
  //  const totalAmount = 399
    console.log(totalAmount)

    let store = {
      store_url: store_url,
      firstname: storeData.name,
      lastname: "Test",
      email: storeData.email,
      phone: storeData.phone,
    };
    let billingData = {
      billing_amount: totalAmount,
      billing_start_date: date,
      billing_currency: "INR",
      billing_cycle: "YEARLY",
    };
    let paymentData = createPayment(store, billingData, totalAmount);
    console.log(paymentData, "-----------------------------");
    const createBillingHistory = await BillingHistory.create({
        store_url: store_url,
        given_credit: getPlanData.plan_limit,
        monthly_charge: totalAmount,
        usage_charge: getPlanData.usage_charge,
        planName: getPlanData.plan_name,
        cappedAmount: getPlanData.usage_limit,
        transaction_id: paymentData.txnid
      });

    res.json({
      ...respondWithData("payment URL"),
      data:{payload : paymentData,
        url : process.env.payupaymenturl}
    });
    // res.send(paymentData[0]);
  } catch (err) {
    logger.info(err);
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
  console.log(req, "------------requewt body-------------------");
  let reqData = req.body;
  console.log(reqData, "-----------------request data--------------------");
  if (reqData.status == "success") {
    await updateBillingHistory(reqData);
    // await stores.findOneAndUpdate
  }
  return res.redirect(`${process.env.CLIENT_URL}kyc-status?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxYy1wbHVzLXN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2OTE2NjY1MjJ9.WdLbbyBhAR8h1RH1hn92lAYjuvUNVC-fKDfQR37U2hQ`);
};

export const failurePayment = async (req,res) => {
    return res.redirect(`${process.env.CLIENT_URL}select-plan`);
}

const updateBillingHistory = (data) => {
  const updateBilling = BillingHistory.findOneAndUpdate(
    { transaction_id :data.txnid },
    { status: "ACTIVE" }
  );
  console.log(updateBilling);
  const updateStoreData = store.findOneAndUpdate({email : data.email, mandate : data})
};
