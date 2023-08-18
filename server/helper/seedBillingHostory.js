import { faker } from '@faker-js/faker';
import BillingHistory from '../models/BillingHistory';
import { calculateGST } from '../controllers/BillingController';
import plan from '../models/plan.js';

/**
 * Seed Billing History Data
 * 
 * @param {*} plan 
 * @returns 
 */
const seedBillingHistory = async(plan) => {

    // const flag = await updateBilling(200, "qc-plus-store.myshopify.com");
    // console.log(flag);
    // return res.sendStatus(200);

    const used_credit = faker.number.int({min:15000, max:100000});
    let tempDate = new Date(), y = tempDate.getFullYear(), m = tempDate.getMonth(), d= tempDate.getDate();
    m = m-1;
    const issue_date = new Date(y, m, d);
    const billingExp = new Date(y+10, m, d);
    const monthDays = new Date(y, m+1, 0).getDate();
    const currentDate = new Date();
    const currentDay = currentDate.getDate(); //Get the current day of the month
    const remainingDays = parseInt(monthDays) - currentDay;
    const dailyRate = plan.price / parseInt(monthDays);
    const calculatedPayment = remainingDays * dailyRate;
    console.log(remainingDays,dailyRate,calculatedPayment)
    const calculatedGst = calculateGST(calculatedPayment);
    const totalAmount = (parseFloat(calculatedPayment) + parseFloat(calculatedGst));

    const company = faker.company.name();
    const billingData = {
        id: `BL${faker.number.int()}`,
        store_id: faker.number.int({min:100000000000, max:999999999999}),    
        store_url: `${company.split(" ").join("-")}.myshopify.com`,
        marchant_name: company,
        given_credit: plan.plan_limit,
        montly_charge: plan.price,
        used_credit: used_credit,
        monthly_gst: calculatedGst,
        usage_charge: plan.usage_charge,
        planName: plan.plan_name,
        usage_limit: plan.usage_limit,
        upfront_amount: calculatedPayment,
        oracleUserId: faker.number.int({min:10000, max:99999}),
        invoiceAmount: totalAmount,
        planEndDate: billingExp,
        status: "ACTIVE",
        issue_date: issue_date,
        billingDate: issue_date,
        remiderDate: reminderDate,
        transaction_id: faker.string.alphanumeric({min:10})
    };
    billingData.extra_usage =  billingData.used_credit > billingData.given_credit ? billingData.used_credit - billingData.given_credit : 0;
    billingData.extra_usage_amount = ((parseFloat(billingData.extra_usage) * parseFloat(billingData.usage_charge)) / 100).toFixed(2);
    billingData.extra_usage_gst = calculateGST(billingData.extra_usage_amount);
    billingData.total_amount = (parseFloat(billingData.montly_charge) + parseFloat(billingData.extra_usage_amount)).toFixed(2);
    billingData.invoiceAmount = (parseFloat(billingData.upfront_amount) + parseFloat(billingData.monthly_gst)).toFixed(2);
    await BillingHistory.create(billingData).then(res => console.log(res));
    return 1;
}

/**
 * Seed Dummy Data For the Testing
 * 
 * @returns 
 */
export const seedDummyData = async() => {

    const plans = await plan.find({});
    for (let i = 0; i < 1; i++) {

        const randInt = faker.number.int({min:0, max:1});
        console.log(randInt, plans[randInt]);
        await seedBillingHistory(plans[randInt]);
    }
    return 1;
}


/**
 * Seed Dummy Data For the Testing
 * 
 * @returns 
 */
export const seedChangedData = async() => {

    const plans = await plan.find({});
    const stores = [
        "Conn---Armstrong.myshopify.com", "Wisozk-Group.myshopify.com", "Kertzmann,-Conn-and-Gislason.myshopify.com",
        "Skiles-Group.myshopify.com", "Rodriguez-and-Sons.myshopify.com", "Wilderman,-Schmitt-and-Cremin.myshopify.com"
    ];
    for (let i = 0; i < 1; i++) {

        await seedPlanChange(plans[2], "Veum,-Lemke-and-Sauer.myshopify.com");
    }
    return 1;
}


/**
 * Seed Change Plan Data
 * 
 * @param {*} plan 
 * @param {*} storeUrl 
 * @returns 
 */
const seedPlanChange = async(plan, storeUrl) => {

    const exisitngData = await BillingHistory.findOne({store_url: storeUrl});
    const tempDate = new Date(), y = tempDate.getFullYear(), m = tempDate.getMonth(), d= tempDate.getDate();
    const issue_date = new Date(y, m-1,d);
    const remainingDays = 30 - d;
    const dailyRate = plan.price / 30;
    const calculatedPayment = remainingDays * dailyRate;
    console.log(remainingDays,dailyRate,calculatedPayment)
    const calculatedGst = calculateGST(calculatedPayment);
    const totalAmount = parseFloat(calculatedPayment) + parseFloat(calculatedGst);
    const billingData = {
        id:`BL${faker.number.int()}`,
        store_url: storeUrl,
        given_credit: plan.plan_limit,
        montly_charge: plan.price,
        monthly_gst: calculatedGst,
        usage_charge: plan.usage_charge,
        planName: plan.plan_name,
        used_credit: 0,
        usage_limit: plan.usage_limit,
        upfront_amount: calculatedPayment,
        planEndDate: exisitngData.planEndDate,
        status: "ACTIVE",
        oracleUserId: exisitngData.oracleUserId,
        issue_date: issue_date,
        billingDate: exisitngData.billingDate,
        remiderDate: exisitngData.remiderDate,
        transaction_id: faker.string.alphanumeric({min: 10}),
        total_amount: totalAmount,
        recordType: "Upgraded"
    };
    billingData.extra_usage =  billingData.used_credit > billingData.given_credit ? billingData.used_credit - billingData.given_credit : 0;
    billingData.extra_usage_amount = ((parseFloat(billingData.extra_usage) * parseFloat(billingData.usage_charge)) / 100).toFixed(2);
    billingData.extra_usage_gst = calculateGST(billingData.extra_usage_amount);
    billingData.invoiceAmount = (parseFloat(billingData.upfront_amount) + parseFloat(billingData.monthly_gst)).toFixed(2);
    await BillingHistory.create(billingData).then(res => console.log(res));
    exisitngData.planEndDate = issue_date;
    exisitngData.status = "UPGRADED";
    await exisitngData.save();
    return 1;
}