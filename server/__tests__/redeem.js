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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxYy10ZXN0LXN0b3JlLTEyLm15c2hvcGlmeS5jb20iLCJpYXQiOjE3MDM1NjkyOTQsImV4cCI6MTcwMzY1NTY5NH0.N9yZHTj-xg5KbbgRnkqXXALoadjbFe-oJDUumNO8FwY";
        console.log(token);
        const payload = {
          orderId: "5530600243359", 
          line_items:[{
            id: "13151508103327",
            qty: 0
          }], 
          amount:"50",
          refund_type: "Back-to-Source",
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