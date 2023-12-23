import { orderCancel, ordercreateEvent } from "../controllers/webhookController.js";
import orders from "../models/orders.js";
import {describe, expect, test} from '@jest/globals';
import { app } from "../server";
import  request  from "supertest";

//app running status test
describe("Project Setup testing, api: /", () => {
  it("It will check project running status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(404);
  });
});

// describe("Test Order Cancel With Refund", () => {

//     test("Call Shopify API to cancel the order", async () => {

//         const orderData = await orders.findOne({id: "5675015602493"});
//         console.log("Order Data Found:");
//         //const resp = await orderCancel(orderData, "qc-plus-store-3.myshopify.com");
//         const resp = await ordercreateEvent("qc-plus-store-3.myshopify.com", orderData);
//         expect(resp).toEqual(1);
//     }, 30000);
// });