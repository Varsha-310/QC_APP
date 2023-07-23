import { faker } from '@faker-js/faker';
import BillingHistory from '../models/BillingHistory';

export const seedBillingHistory = async(req, res) => {

    await BillingHistory.create({
        id: faker.number.int(),
        store_id: "64901677269",    
        store_url: "qwikcilver-demo.myshopify.com",
        given_credit: "40000",
        used_credit: faker.number.int({min:35000, max:100000}),
        montly_charge: 799,
        usage_charge: "2.25",
        planName: "Pro",
        status: "ACTIVE", 
        lastBilledDate: faker.date.soon(),
    });
    res.sendStatus(200);
}