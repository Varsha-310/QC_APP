import orders from "../models/orders.js";
import {describe, expect, test} from '@jest/globals';
import { app } from "../server";
import  request  from "supertest";

//app running status test
// describe("Project Setup testing, api: /", () => {
//   it("It will check project running status", async () => {
//     const res = await request(app).get("/");
//     token = res.body.token;
//     expect(res.statusCode).toEqual(200);
//   });
// });

describe("Test Order Cancel With Refund", () => {

    test("Call Shopify API to Test Refund", async () => {

        // const res = await request(app).get("/");
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxYy1wbHVzLXN0b3JlLTMubXlzaG9waWZ5LmNvbSIsImlhdCI6MTcwMzQwMjA4MiwiZXhwIjoxNzAzNDg4NDgyfQ.4pW-Rj5OrUfNZV1pGromnW5SAu66G79hwuk5yzIolGw";
        console.log(token);
        const payload = {
          orderId: "5677952532797", 
          line_items:[{
            id: "14599827423549",
            qty: 0
          }], 
          amount:"50",
          refund_type: "Store-credit",
        };
        const resp  = await request(app)
            .post("/refund/initiate")
            .send(payload)
            .set("authorization", token)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        console.log(JSON.stringify(resp.body));
        expect(resp.statusCode).toEqual(200);
    }, 30000);
});