
import { changeMonthlyCycle } from "../controllers/BillingController";
import  request  from "supertest";
import { app } from "../server.js";
import { seedChangedData, seedDummyData } from "../helper/seedBillingHostory";

const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZV91cmwiOiJxYy1wbHVzLXN0b3JlLm15c2hvcGlmeS5jb20iLCJpYXQiOjE2OTA1MzIzNjd9.JItHJoRVsFltBpUz9rv-2O62I6Uf9Ks4dJufk-SupKM";


// // Get Current Uses,
// describe("Billing: Current Uses",() => {
    
//     it(`api:/billing/current/uses`, async () => {
//       const res = await request(app)
//             .get('/billing/current/uses')
//             .set("authorization", authorization);
//       // console.log(res.body);
//       expect(res.body.success).toEqual(true);
//     });
// });


/**
 * Billing List
 */
// describe("Billing: List",() => {
    
//     it(`api:/billing/list`, async () => {
//       const res = await request(app)
//             .get('/billing/list')
//             .set("authorization", authorization);
//       // console.log(res.body);
//       expect(res.body.success).toEqual(true);
//     });
// });


/**
 * Change Billing Cyecle on month end
 */
// describe("Billing: Chnage Cycle",() => {
    
//   it(`Chnage Monthly Cycle`, async () => {
    
//     const res = await seedDummyData();
//     // console.log(res.body);
//     expect(res).toEqual(1);
//   });
// });

/**
 * Change Billing Cyecle on month end
 */
// describe("Billing: Chnage Cycle",() => {
    
//   it(`Chnage Monthly Cycle`, async () => {
    
//     const res = await seedChangedData();
//     // console.log(res.body);
//     expect(res).toEqual(1);
//   });
// });

/**
 * Change Billing Cyecle on month end
 */
describe("Billing: Chnage Cycle",() => {
    
    it(`Chnage Monthly Cycle`, async () => {
      
      const res = await changeMonthlyCycle();
      // console.log(res.body);
      expect(res).toEqual(1);
    });
});