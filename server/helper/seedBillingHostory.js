// // //import { faker } from '@faker-js/faker';
// // import BillingHistory from '../models/BillingHistory';
// import { calculateGST, checkActivePlanUses, updateBilling } from '../controllers/BillingController';

// export const seedBillingHistory = async(req, res) => {

//     const flag = await updateBilling(200, "qc-plus-store.myshopify.com");
//     console.log(flag);
//     return res.sendStatus(200);
//     const used_credit = faker.number.int({min:15000, max:100000});
//     const billingData = {
        
//         id: faker.number.int(),
//         store_id: "64901677287",    
//         store_url: "qwikcilver-plus.myshopify.com",
//         given_credit: "20000",
//         used_credit: used_credit,
//         montly_charge: 399,
//         usage_charge: 2.5,
//         planName: "Basic",
//         status: "BILLED", 
//         oracleUserId: "OU124",
//         lastBilledDate: faker.date.soon(),
//         remiderDate: faker.date.past({
//             refDate: 30
//         }),
//         isReminded: false,
//         planEndDate: faker.date.future({
//             years: 10
//         }),
//         notifiedMerchant: 1,
//         cappedAmount:100000,
//         invoiceNumber: faker.number.int({ min: 4000, max: 6000}),
//         invalideDate: faker.date.past({
//             refDate: 30
//         }),
        
//         invoiceUrl: faker.image.url(),
//         transaction_id: faker.string.alphanumeric()
//     };
//     billingData.monthly_gst = calculateGST(billingData.montly_charge);
//     billingData.extra_uasge =  billingData.used_credit - billingData.given_credit;
//     billingData.extra_usage_amount = ((parseFloat(billingData.extra_uasge) * parseFloat(billingData.usage_charge)) / 100).toFixed(2);
//     billingData.extra_usage_gst = calculateGST(billingData.extra_usage_amount);
//     billingData.total_amount =  (parseFloat(billingData.montly_charge) + parseFloat(billingData.extra_usage_amount) + parseFloat(billingData.monthly_gst) + parseFloat(billingData.extra_usage_gst)).toFixed(2);
//     billingData.invoiceAmount =  billingData.total_amount;

//     await BillingHistory.create(billingData).then(res => console.log(res));
//     res.sendStatus(200);
// }