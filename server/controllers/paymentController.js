import axios from "axios";
import { createPayment, verifyPayuTranscation } from "../middleware/payU.js";
import { calculateGST } from "./BillingController.js";
import BillingHistory from "../models/BillingHistory.js";
import plan from "../models/plan.js";
import { logger } from "../helper/utility.js";
import { respondWithData, respondInternalServerError } from "../helper/response.js";
import stores from "../models/store.js";


/**
 * create payment
 * @param {*} req
 * @param {*} res
 */
export const create = async (req, res) => {
  try {
    console.log("-----------------creating payment------------------------");
    // const store_url = req.token.store_url
    const store_url = "mmtteststore8.myshopify.com";
    const getPlan = stores.find({ store_url: store_url});
    const currentDate = new Date();
    const currentDay = currentDate.getDate(); // Get the current day of the month
    const remainingDays = 30 - currentDay;
    const dailyRate = getPlan.plan_price / 30;
    const calculatedPayment = remainingDays * dailyRate;

    const calculatedGst = calculateGST(calculatedPayment);
    const totalAmount = calculatedPayment + calculatedGst;
    const createBillingHistory = BillingHistory.create({
      store_url: store_url,
      given_credit: "20000",
      monthly_charge: totalAmount,
      usage_charge: "2.00",
      planName: "Basic",
      cappedAmount: "120000",
    });

    let store = {
      store_url: "test.myshopify.com",
      firstname: "Test",
      lastname: "Test",
      email: "test@gmail.com",
      phone: 999999999,
    };
    let billingData = {
      billing_amount: 300,
      billing_start_date: "2023-08-01",
      billing_currency: "INR",
      billing_cycle: "YEARLY",
    };
    let paymentData = createPayment(store, billingData, 300);
    console.log(paymentData, "-----------------------------");
    res.json({
      ...respondWithData("payment URL"),
      data:{payload : paymentData,
        url : process.env.payupaymenturl}
    });
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
  return res.redirect(`${APP_URL}/`);
};

const updateBillingHistory = (data) => {
  const updateBilling = BillingHistory.findOneAndUpdate(
    { store_url: "mmtteststore.myshopify.com" },
    { transaction_id: data.txnid, status: "ACTIVE" }
  );
  console.log(updateBilling);
};
