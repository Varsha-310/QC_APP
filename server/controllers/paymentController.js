import axios from "axios";
import {createPayment,verifyPayuTranscation} from "../middleware/payU.js";


export const create = async (req, res) => {
    console.log("-----------------creating payment------------------------")
    let store = {
        store_url : "test.myshopify.com",
        firstname : 'Test',
        lastname : 'Test',
        email : 'test@gmail.com',
        phone : 999999999
    }
    let billingData = {
        billing_amount : 300,
      billing_start_date: "2023-08-01",
      billing_currency: "INR",
      billing_cycle: "YEARLY"
    }
    let paymentData = createPayment(store,billingData,300);
    console.log(paymentData[0],"-----------------------------",paymentData[1]);
    res.send(paymentData[0]);
}

export const payuPayment = async(req,res) => {
    console.log(req,"------------requewt body-------------------")
    let reqData = req.body;
    console.log(reqData, "-----------------request data--------------------")
    if(reqData.status == 'success') {
        await updateBilling(reqData);        
    }
    return res.redirect(`${CLIENT_URL}/}`);
}


