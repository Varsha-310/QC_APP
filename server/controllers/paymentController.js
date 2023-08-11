import axios from "axios";
import { createPayment, verifyPayuTranscation } from "../middleware/payU.js";
import { calculateGST } from "./BillingController.js";
import BillingHistory from "../models/BillingHistory.js";
import plan from "../models/plan.js";
import { logger } from "../helper/utility.js";
import { respondWithData, respondInternalServerError } from "../helper/response.js";
import stores from "../models/store.js";
import store from "../models/store.js";
import { generateCSV } from "./kycController.js";


/**
 * create payment
 * @param {*} req
 * @param {*} res
 */
export const create = async (req, res) => {
  try {
    
    console.log(req.token,"-----------------creating payment------------------------");
    const store_url = req.token.store_url
    //  const store_url = "qc-plus-store.myshopify.com";
    const storeData = await stores.findOne({ store_url: store_url});
    console.log(storeData)
    const getPlanData = await plan.findOne({plan_name : req.body.plan_name});
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
    console.log(totalAmount)

    let store = {
      store_url: store_url,
      firstname: storeData.name,
      plan_name : req.body.plan_name,
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

    const tempDate = new Date(), y = tempDate.getFullYear(), m = tempDate.getMonth(), d= tempDate.getDay();
    const billingExp = new Date(y+10, m, d);
    await BillingHistory.updateOne({
            store_url: store_url,
            status: "PENDING"
    },{
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

        planEndDate: billingExp
    }, {upsert: true});

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
    }
    return res.redirect(`${process.env.CLIENT_URL}kyc-status?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxYy1wbHVzLXN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2OTE2NjY1MjJ9.WdLbbyBhAR8h1RH1hn92lAYjuvUNVC-fKDfQR37U2hQ`);
};

export const failurePayment = async (req,res) => {
    return res.redirect(`${process.env.CLIENT_URL}payment-unsuccessful?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxYy1wbHVzLXN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2OTE2NjY1MjJ9.WdLbbyBhAR8h1RH1hn92lAYjuvUNVC-fKDfQR37U2hQ`);
}

const updateBillingHistory = async (data) => {

    const tempDate = new Date(), y = tempDate.getFullYear(), m = tempDate.getMonth(), d= tempDate.getDay();
    const issue_date = new Date(y, m, d);
    const billingDate = new Date(y, m+1, 10);
    const reminderDate = new Date(y, m+1, 6);
    await BillingHistory.updateMany({store_url: data.productinfo , status :"ACTIVE"} , {status : "UPGRADED"});
    const updateBilling = await BillingHistory.updateOne(
        { transaction_id : data.txnid },
        { 
            status: "ACTIVE",
            issue_date: issue_date,
            billingDate: billingDate,
            remiderDate: reminderDate 
        }
    );
    console.log(updateBilling);
   await store.updateOne(
        { store_url: data.productinfo },
        { $set: { "plan.plan_name": data.lastname } }
      );
    await store.findOneAndUpdate({email : data.email, mandate : data});
    await generateCSV();
    return 1;
};
