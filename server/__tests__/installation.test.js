import {request } from 'supertest';
import { app } from "../server";

// app running status test
describe('Project Setup testing, api: /', () => {
    it('It will check project running status', async () => {
      const res = await request(app)
      .get('/');
      expect(res.statusCode).toEqual(200);
    });
});

// app installation api test
describe('Installation: App installation api', () => {
    it(`api: /install`, async () => {
        const res = await request(app)
        .get(`/shopify/install`)
        .query({
          shop : "mmtteststore8.myshopify.com"
        })
        expect(res.statusCode).toEqual(200);
    });
});

/** 
 * Check callback api 
 * 302 = on success it will redirect to the setting page
 * 400 = in this case shopify validation code has been used or expired
*/
describe('Installation:  callback api', () => {

    it(`api: /shopify/install/callback`, async () => {
        const res = await request(app)
        .get(`/shopify/install/callback?code=0cfa7fa3238c0a73f1e39b6010f61fd2&hmac=a27ad1622257d0d31948890a1a45f4eecd339830d96684c01381cf3a76918d5d&host=cGx1cy10ZXN0aW5nLXN0b3JlLm15c2hvcGlmeS5jb20vYWRtaW4&shop=${STORE}&state=165899398090000&timestamp=1658993982`)
        .set("cookie", "state=165899398090000");
        expect(res.statusCode).toEqual(400 || 200);
    });
});