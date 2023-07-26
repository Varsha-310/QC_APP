import { faker } from '@faker-js/faker';
import BillingHistory from '../models/BillingHistory';

export const seedBillingHistory = async(req, res) => {

    const used_credit = faker.number.int({min:35000, max:100000});
    const billingData = {
        id: faker.number.int(),
        store_id: "64901677269",    
        store_url: "qwikcilver-demo.myshopify.com",
        given_credit: "40000",
        used_credit: used_credit,
        montly_charge: 799,
        usage_charge: "2.25",
        planName: "Pro",
        status: "BILLED", 
        lastBilledDate: faker.date.soon(),
        remiderDate: faker.date.past({
            refDate: 30
        }),
        isReminded: true,
        planEndDate: faker.date.future({
            years: 10
        }),
        cappedAmount: '100000',
        invoiceNumber: faker.number.int({ min: 4000, max: 6000}),
        invalideDate: faker.date.soon(),
        invoiceUrl: faker.image.url()
    };
    billingData.extra_uasge =  billingData.used_credit - billingData.given_credit;
    billingData.additional_amount = (parseFloat(billingData.extra_uasge) * parseFloat(billingData.usage_charge)) / 100;
    billingData.total_amount =  (billingData.montly_charge + billingData.additional_amount).toFixed(2);
    billingData.invoiceAmount =  billingData.total_amount;
    console.log(billingData);
    await BillingHistory.create(billingData).then(res => console.log(res));
    res.sendStatus(200);
}