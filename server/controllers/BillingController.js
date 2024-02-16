import axios from "axios";
import { respondInternalServerError, respondSuccess, respondWithData } from "../helper/response.js";
import BillingHistory from "../models/BillingHistory.js";
import store from "../models/store.js";
import crypto from "crypto";
import Session from "../models/session.js";
import template from "../views/plan_limit_exceed.js";
import half_limit_template from "../views/half_limit_exceed.js";
import complete_limit_template from "../views/complete_limit_exceed.js";
import { sendEmail } from "../middleware/sendEmail.js";
import cron from "node-cron";

/**
 * Handle the corn iteration for the send Predebit Notification
 * 
 */
const handleMandateNotification = async(type) => {

    const today = new Date().getDate();
    if([29].includes(today)){
    console.log("-----------")
        const notificableMarchant = await BillingHistory.find({
            status: "ACTIVE",
            isReminded: false,
            recordType: "Reccuring",
            // plan_type: "public"
        });
        console.log(notificableMarchant);
        for (const bill of notificableMarchant) {
     console.log(bill , "bill");
            if(bill.invoiceAmount){

                const resp = await sendMandateNotification(bill);
                bill.remark = resp.message;
                bill.isReminded = resp.status == 1 ? true : false;
                await bill.save();
            }else{

                //TODO: Send notification to the about the missing invoice number 
            }
            continue;
        }
    }
    return 1;    
}

/**
 * Generate Hash for the pre debit notification
 * 
 * @param {*} payload 
 * @returns 
 */
const generateHashForNotification = (payload) => {

    console.log("Given Payload", payload);
    let paymentString = `${payload.key}|${payload.command}|${payload.var1}|${process.env.payusalt}`;
    console.log(paymentString, "payment string");
    const hash = crypto.createHash("sha512");
    hash.update(paymentString, "utf-8");
    return hash.digest("hex");    
}

/**
 * Manage Pre Debit Notification
 * 
 * @param {*} invoiceAmount 
 * @param {*} InvoiceNumber 
 * @param {*} store_url 
 * @returns 
 */
const sendMandateNotification = async(bill) => {

    const mandateDetails = await store.findOne({store_url :bill.store_url}, {mandate:1, store_url:1});
    console.log(mandateDetails , "----------mandate details----------------")
    if(!mandateDetails){ 

        //TO-DO: Send Notification to the QC regading it 
        return "mandate Not Found"; 
    };
    const session = {

        type: "PRE-DEBIT-NOTIFICATION",
        store_url: bill.store_url,
        date: Date.now(),
        ref: bill.id,
        amount: bill.invoiceAmount,
        plan: bill.plan,
        seesion_id: Date.now() + Math.random().toString(10).slice(2, 7),
    };
    const apiResp = await callPayUNotificationAPI(bill, mandateDetails.mandate);
    if(apiResp.status == 1){

        session.status = "completed";
    }else{

        session.status = "retry";
        session.retry_at = Date.now();
    }
    session.logs = apiResp;
    session.remark = apiResp.message;
    await Session.insert(session);
    return apiResp;
}

/**
 * Handle PayU Pre Debit Notiication API
 * 
 * @param {*} bill
 * @param {*} mandateDetails 
 * @returns 
 */
const callPayUNotificationAPI = async(bill, mandateDetails) =>{
console.log(mandateDetails , bill.billingDate ,"mandateDetails");
const randomId = Date.now() + Math.random().toString(10).slice(2, 8);
const date = new Date(bill.billingDate),
 year =date.getFullYear(),
 mnth = ("0" + (date.getMonth() + 1)).slice(-2),
 day = ("0" + date.getDate()).slice(-2);
const debitDate = `${year}-${mnth}-${day}`;
let payemntPayload = new FormData();
     payemntPayload = {
        key : process.env.payukey,
        command: "pre_debit_SI",
        var1:`{"authPayuId": "${mandateDetails?.mihpayid}", "requestId": "${randomId}" ,"debitDate": "${debitDate}", "invoiceDisplayNumber": "${bill.invoiceNumber}","amount": ${bill.invoiceAmount}, "action":"retreive"}`
    }
    payemntPayload["hash"] = generateHashForNotification(payemntPayload);
    const config ={

        url: process.env.DEBUG ? "https://test.payu.in/merchant/postservice.php?form=2" : "https://info.payu.in/merchant/",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data : payemntPayload

    };
    console.log(payemntPayload, config);
    return axios(config).then(res => {
        console.log(res , "response of ")
        return res;
    }).catch(err => {

        console.log("Error",err);
        return {
            "status": "2",
            "action": "MANDATE_PRE_DEBIT",
            "message": "Exernal Error Occured"
        };
    });
}

/**
 * Handle the corn iteration for the send Predebit Notification 
 */
const handleReccuringPayment = async() => {

    const today = new Date().getDate();
    if([14].includes(today)){
        const reccuringmarchant = await BillingHistory.find({
            status:"ACTIVE",
            // recordType: "Reccuring",
            // isReminded: true,
            store_url:"uat-kyc-test-automation.myshopify.com"
            // plan_type: "public"
        });
        console.log(reccuringmarchant , "ertyuio")
        for (const bill of reccuringmarchant) {

            const resp = await captureReccuringpayment(bill);
            bill.remark = resp.message;
            bill.status = resp.status == 1 ? "BILLED" : bill.status;
            await bill.save();
        }
    }
    return 1;
}

const captureReccuringpayment = async(bill) => {

    const mandateDetails = await store.findOne({store_url : bill.store_url}, {mandate:1, store_url:1});
    if(!mandateDetails){ 

        //TO-DO: Send Notification to the QC regading it 
        return "mandate Not Found"; 
    };
    const session = {

        type: "RECURRING",
        store_url: bill.store_url,
        date: Date.now(),
        amount: bill.invoiceAmount,
        ref: bill.id,
        plan: bill.plan,
        seesion_id: Date.now() + Math.random().toString(10).slice(2, 7),
    };
    const apiResp = await callPayUReccuringAPI(bill, mandateDetails);
    if(apiResp.status == 1){

        session.status = "completed";
    }else{

        session.status = "retry";
        session.retry_at = Date.now();
    }
    session.logs = apiResp;
    // await Session.insert(session);
    return apiResp;
}


/**
 * Handle PayU Pre Debit Notiication API
 * 
 * @param {*} bill
 * @param {*} mandateDetails 
 * @returns 
 */
const callPayUReccuringAPI = async(bill, mandateDetails) =>{
    console.log(bill , mandateDetails , "recurring api called")
    let data = new FormData();
    const randomId = Date.now() + Math.random().toString(10).slice(2, 8);
     data = {
        key : process.env.payukey,
        command: "si_transaction",
        var1:`{"authpayuid":"${mandateDetails?.mandate?.mihpayid}","invoiceDisplayNumber":"${bill.invoiceNumber}","amount":${bill.invoiceAmount},"txnid":"${randomId}","email":"anubhav.gupta_conslt@qwikcilver.com","phone":"${mandateDetails?.mandate?.phone}","udf2": "","udf3": "","udf4": "","udf5": ""}`
    };
    data["hash"] = generateHashForNotification(data);
    const config ={

        url: process.env.DEBUG ? "https://test.payu.in/merchant/postservice?form=2" : "https://info.payu.in/merchant/",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: data
    };
    console.log(data, config);
    // return axios(config).then(res => {
    //     console.log(res , "response")
    //     return res;
    // }).catch(err => {

    //     console.log("Error",err);
    //     return {
    //         "status": "0",
    //         "message": "Exernal Error Occured"
    //     };
    // });
    let res = await axios(config);
    console.log(res, "response new")
}

/**
 * Send first notification to the marchant
 * 
 * @param {*} store 
 * @param {*} baseAmount 
 * @param {*} capAmount 
 * @returns 
 */
export const firstNotification = async(store_url) => {
    const storeDetails = await store.findOne({store_url:store_url});
    const getBilling = await BillingHistory.findOne({store_url:store_url , status: "ACTIVE"});
    

    console.log("firstNotification");
    let email_template = template;
    email_template = email_template.replace("__merchant__", storeDetails.name);
  email_template = email_template.replace("__plan_name__", storeDetails.plan.plan_name);
  email_template = email_template.replace(
    "__given_credit__",
    getBilling.given_credit
  );
  email_template = email_template.replaceAll(
    "__usage_charge__",
    getBilling.usage_charge
  );
  email_template = email_template.replace(
    "__usage_limit__",
    getBilling.usage_limit
  );
    const options = {
        from: "merchantalerts@qwikcilver.com",
        to: storeDetails.email,
        subject: "PLAN LIMIT EXCEEDED",
        html: email_template,
      };
      await sendEmail(options);
    return 0;
}

/**
 * send 2nd notification to the marchant
 * 
 * @param {*} store 
 * @param {*} baseAmount 
 * @param {*} capAmount 
 * @returns 
 */
export const secondNotification = async (store_url, baseAmount, capAmount) => {
    const storeDetails = await store.findOne({store_url:store_url});
    const getBilling = await BillingHistory.findOne({store_url:store_url , status: "ACTIVE"});
    let email_template = half_limit_template
    email_template = email_template.replace("__merchant__", storeDetails.name);
    email_template = email_template.replace("__plan_name__", storeDetails.plan.plan_name);
    email_template = email_template.replaceAll(
      "__usage_limit__",
      getBilling.usage_limit
    );
    console.log("secondNotification");
    const options = {
        from: "merchantalerts@qwikcilver.com",
        to: storeDetails.email,
        subject: "PLAN LIMIT EXCEEDED",
        html: email_template,
      };
      await sendEmail(options);
    return 0;
}

/**
 * Send third notification to the marchnat
 * 
 * @param {*} store 
 * @param {*} baseAmount 
 * @param {*} capAmount 
 * @returns 
 */
export const thirdNotification = async(store_url, baseAmount, capAmount) => {

    console.log("thirdNotification");
    const storeDetails = await store.findOne({store_url:store_url});
    const getBilling = await BillingHistory.findOne({store_url:store_url , status: "ACTIVE"});
    let email_template = complete_limit_template
    email_template = email_template.replace("__merchant__", storeDetails.name);
    email_template = email_template.replace("__plan_name__", storeDetails.plan.plan_name);
    email_template = email_template.replaceAll(
      "__usage_limit__",
      getBilling.usage_limit
    );
    console.log("thirdNotification");
    const options = {
        from: "merchantalerts@qwikcilver.com",
        to: storeDetails.email,
        subject: "PLAN LIMIT EXCEEDED",
        html: email_template,
      };
      await sendEmail(options);
    return 0;
}

/**
 * 
 * @param {*} store
 */
export const checkActivePlanUses = async(amount, store_url) => {

    try {
        
        const billingData = await BillingHistory.findOne({store_url, status:"ACTIVE" });
        if(billingData){
            
            let flag = 0;
            const incoming_amount = (parseFloat(billingData.used_credit) + parseFloat(amount)).toFixed(2);
            const total_allowd = (parseInt(billingData.given_credit) + parseInt(billingData.usage_limit));
            if(parseInt(incoming_amount) > total_allowd){
                
                flag = 3;
            }else if(incoming_amount >= total_allowd/2){

                flag = 2;
            }else if(incoming_amount >= billingData.given_credit){

                flag = 1;
            }

            console.log("flag:", flag);
            if(flag > 0 && flag == billingData.notifiedMerchant){
                return flag === 3 ? 3 : 0;
            }else{
                
                switch (flag) {
                    case 1:
                        await firstNotification(store_url);
                        break;
                    case 2:
                        await secondNotification(store_url);
                        break;
                    case 3:
                        await thirdNotification(store_url)
                        break;
                }
                billingData.notifiedMerchant = flag;
                await billingData.save();
                return flag === 3 ? 3 : 0;
            }
        }
    } catch (error) {
        
        console.log(error);
        return 4;
    }
    // 0 - active 
    // 1 - crossed base amount
    // 2 - crossed 50% of the cap amount 
    // 3 - crossed 100% of the cap amount
    // 4 - Error Encountered
    //notifyMarchant()
}

/**
 * Update Billing Status
 * 
 * @param {*} amount 
 * @param {*} store_url 
 * @returns 
 */
export const updateBilling = async(amount, store_url) => {

    const billingData = await BillingHistory.findOne({ store_url, status:"ACTIVE" });
    console.log(":", amount, billingData);
    if(billingData){
        
        const billing = {
            used_credit: (parseFloat(billingData.used_credit) + parseFloat(amount)).toFixed(2)
        };
        billing.extra_usage =  billing.used_credit > billingData.given_credit ? (parseFloat(billing.used_credit) - billingData.given_credit) : 0;
        billing.extra_usage_amount = ((parseFloat(billing.extra_usage) * parseFloat(billingData.usage_charge)) / 100).toFixed(2);
        billing.extra_usage_gst = calculateGST(billing.extra_usage_amount);
        billing.total_amount = (parseFloat(billingData.montly_charge) + parseFloat(billing.extra_usage_amount)).toFixed(2);
        console.log(billing);
        await BillingHistory.updateOne({id: billingData.id}, billing);
        return true;
    }
    return false;
}

/**
 * Calculate GST
 * 
 * @param {*} amount 
 * @returns 
 */
export const calculateGST = (amount) => {

    const gst = process.env.GST_PERCENTAGE || 18;
    return ((parseFloat(amount) * parseFloat(gst))/100).toFixed(2);
}

/**
 * Handle Payment Callback Webhook
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const handleCallbackWebhook = (req, res) => {

    try {
        
        return res.json(respondSuccess())
    } catch (error) {
        
        console.log(error);
        return res.json(respondInternalServerError());
    }
} 

/**
 * Hanldle Billing List Request
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const handleBillingList = async(req, res) => {

    try {
       
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 20;
        let skip = (page - 1) * limit;
        const storeUrl = req.token.store_url;
        console.log(storeUrl);
        const billing = await BillingHistory.find({ store_url: storeUrl, status: "BILLED"})
            .skip(skip)
            .limit(limit);
        const count = await BillingHistory.countDocuments({ store_url: storeUrl, status: "BILLED"}); 
        return res.json(respondWithData("Success",{billing, total: count}));
    } catch (err) {

       console.log(err);
       return res.json(respondInternalServerError())
    }
}


/**
 * Hanldle Current Billing Uses
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const handleBillingDetails = async(req, res) => {

    try {

        const {store_url } = req.token;
        console.log(store_url);
        const billing = await BillingHistory.find({
          store_url,
          status:{ $in: ["ACTIVE", "UPGRADED", "FROZEN"]}
        });
        return res.json(respondWithData("Success", billing));
    } catch (err) {
  
        console.log(err);
        return res.json(respondInternalServerError())
    }
}

/**
 * Change Plan On  Month Change
 * 
 */
export const changeMonthlyCycle = async() => {
    
    const date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    if(d != 14){
        return 0;
    }
    const firstday = new Date(y, m, 0);
    const query = {
        store_url : "prod-kyc-test-assisted-flow.myshopify.com",
        status: "ACTIVE",
        // issue_date: {$lt: new Date()}
    }

    console.log(query);
    const tam = await BillingHistory.countDocuments(query);
    console.log("Totoal Documents",tam);

    const upgradedPlans = await BillingHistory.find({...query, status: "UPGRADED"},{store_url:1});
    const upgradedPlansList = upgradedPlans.map(item => item.store_url);
    console.log(upgradedPlansList);

    const count = Math.ceil(tam/100);
    console.log(count);
    for (let i = 0; i < count; i++) {
          
       await processMonthlyPlan(query, upgradedPlansList);
    }
    return 1;
}

/**
 * Process Monthy Plan
 * 
 * @param {*} query 
 * @returns lastDay
 */
const processMonthlyPlan = async(query, upgradedPlansList) => {

    const activeMarchant = await BillingHistory.find(query).limit(100);
    for (const bill of activeMarchant) {

        try{

            console.log("Old Data: ", bill);
            const tempDate = new Date(), y = tempDate.getFullYear(), m = tempDate.getMonth(), d= tempDate.getDate();
            const billingDate = new Date(y, m, 9);
            const reminderDate = new Date(y, m, 6);
            const issue_date = new Date(y,m,d);
            const newInstance = {
                id: `BL${Date.now() + Math.random().toString(10).slice(2, 8)}`,
                store_id: bill.store_id,    
                store_url: bill.store_url,
                given_credit: bill.given_credit, 
                used_credit: 0, 
                extra_usage: 0, 
                usage_charge: bill.usage_charge,
                montly_charge: bill.montly_charge,
                monthly_gst: calculateGST(bill.montly_charge), 
                upfront_amount: bill.montly_charge,
                total_amount: bill.monthly_gst+bill.montly_charge,
                issue_date: issue_date,
                plan_type: bill.plan_type,
                recordType: "Reccuring",
                remiderDate: reminderDate,
                oracleUserId: bill.oracleUserId, 
                planName: bill.planName,
                status: "ACTIVE", 
                billingDate: billingDate,
                planEndDate: bill.planEndDate,
                usage_limit: bill.usage_limit,
                marchant_name: bill?.marchant_name
            }
            let invoiceAmount = parseFloat(newInstance.upfront_amount) + parseFloat(newInstance.monthly_gst);
            invoiceAmount = invoiceAmount + (parseFloat(bill.extra_usage_amount) + parseFloat(bill.extra_usage_gst));
            newInstance.invoiceAmount = invoiceAmount.toFixed(2);

            //Logs Previous Months data 
            newInstance.prevData = await getPrevMonthData(bill);
            
            //check upgraded plans
            if(upgradedPlansList.includes(bill.store_url)){

                const data =  await getChangeMonthData(bill.store_url);
                newInstance.invoiceAmount = parseFloat(newInstance.invoiceAmount) + parseFloat(data.amount);
                newInstance.prevData = data.data.concat(newInstance.prevData) ;
            }
            console.log("New Instance:", newInstance);
            await BillingHistory.create(newInstance);
            bill.status = "FROZEN";
            await bill.save();
        }catch(e) {

            console.log(e)
        }
    }
    return 1;
}

/**
 * Get Last month data for logs
 * 
 * @param {*} bill 
 * @returns 
 */
const getPrevMonthData = async(bill) => {

    const tempDate = new Date(), y = tempDate.getFullYear(), m = tempDate.getMonth(), d= tempDate.getDate();
    const date1 = new Date(bill.issue_date);
    const date2 = new Date(y,m,0);
    const diffDays = date2.getDate() - date1.getDate();
    console.log(date2.getDate(), date1.getDate(), diffDays);
    return [{
        ref_id: bill.id,
        store: bill.store_url,
        extra_usage_amount: bill.extra_usage_amount,
        extra_usage_gst: bill.extra_usage_gst,
        planName: bill.planName,
        type: bill.recordType,
        montly_premium_used: bill.upfront_amount,
        gst_on_monthly_premium: bill.monthly_gst,
        no_of_days: diffDays,
        deducted_preminum: parseFloat(bill.upfront_amount) + parseFloat(bill.monthly_gst)
    }]
}

/**
 * Get Prev Data from history
 * 
 * @param {*} store 
 */
const getChangeMonthData = async(store) => {

    const prevData = await BillingHistory.find({ store_url: store, status: "UPGRADED"});
    let deduction = 0;
    let used =0;
    console.log("Upgraded Plans", prevData);
    const prevUsed = [];
    for (const element of prevData) {
        
        deduction += parseFloat(element.upfront_amount) + parseFloat(element.monthly_gst);
        const date1 = new Date(element.issue_date);
        const date2 = new Date(element.planEndDate);
        const diffDays = date2.getDate() - date1.getDate();
        console.log(date2.getDate(), date1.getDate(),diffDays);
        const oneDayCost = element.montly_charge / 30;
        const used_charge = oneDayCost * diffDays;
        const used_gst = calculateGST(used_charge);
        console.log("Used Day:", diffDays, "Used Amount:", used_charge);
        used+=parseFloat(element.extra_usage_amount)+parseFloat(element.extra_usage_gst) + parseFloat(used_charge) + parseFloat(used_gst);
        prevUsed.push({
            ref_id: element.id,
            store: element.store_url,
            extra_usage_amount: element.extra_usage_amount,
            extra_usage_gst: element.extra_usage_gst,
            planName: element.planName,
            type: element.recordType,
            montly_premium_used: used_charge,
            gst_on_monthly_premium: used_gst,
            no_of_days: diffDays,
            adj_credit: 0 - (parseFloat(element.upfront_amount) - used_charge),
            adj_gst: 0 - (parseFloat(element.monthly_gst) - used_gst),
            deducted_preminum: parseFloat(element.upfront_amount) + parseFloat(element.monthly_gst)
        });
        element.status = "FROZEN";
        await element.save();
    }
    console.log("Deduction:", deduction, "Used:", used);
    console.log("Previous Used:", prevUsed);
    return {
        amount: (used - deduction).toFixed(2),
        data :prevUsed
    };
}

const cancelMandate = async() =>{
    console.log( "recurring api called")
    let data = new FormData();
    const randomId = Date.now() + Math.random().toString(10).slice(2, 8);
     data = {
        key : process.env.payukey,
        command: "mandate_revoke",
        var1:`{"authPayuId":"403993715530976972","requestId":"${randomId}"}`
    };
    data["hash"] = generateHashForNotification(data);
    const config ={

        url: process.env.DEBUG ? "https://test.payu.in/merchant/postservice?form=2" : "https://info.payu.in/merchant/",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: data
    };
    console.log(data, config);
    return axios(config).then(res => {
        console.log(res , "response")
        return res;
    }).catch(err => {

        console.log("Error",err);
        return {
            "status": "0",
            "message": "Exernal Error Occured"
        };
    });
}

cron.schedule("*/30 * * * * *", () => {
 console.log("------cron job-----------")
//  cancelMandate()
    changeMonthlyCycle();
    // handleReccuringPayment();
    // handleMandateNotification();
});
