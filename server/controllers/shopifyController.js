const axios = require('axios');
const store = require("../models/store");
const {respondInternalServerError , respondNotAcceptable } = require("./helper/response");

/**
 * method for installation method
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const install = async (req, res) => {

    try {
        const shop = req.query.shop;
        console.log(req)
        if (shop) {

            const scopes = process.env.SCOPES;
            const apiKey = process.env.SHOPIFY_API_KEY;
            const APP_URL = process.env.APP_URL;
            const state = Date.now();                                          
            const redirectUri = `${APP_URL}/shopify/callback`;
            const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;
            res.cookie("state", state);
            return res.redirect(installUrl);
        } else {
            res.json(respondNotAcceptable("Something went wrong try after sometime"));
        }
    }
    catch (error) {


        res.json(respondInternalServerError("Something went wrong try after sometime"));

    }
};

/**
 * method for installation callback
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const installCallback = async (req, res) => {

    try {

        const { shop, hmac, code, state } = req.query;
        const apiSecret = process.env.SHOPIFY_API_SECRET ?? "";
        const CLIENT_URL = process.env.CLIENT_URL ?? "";
        const apiKey = process.env.SHOPIFY_API_KEY ?? "";
        const API_VERSION = process.env.API_VERSION ?? "";
        const stateCookie = cookie.parse(headersCookies).state;
        if (state !== stateCookie) {
            return res.status(403).send('Request origin cannot be verified');
        }
        if (shop && hmac && code) {

            const query = req.query;
            delete query["signature"];
            delete query["hmac"];
            const message = new URLSearchParams(query).toString();
            const providedHmac = Buffer.from(hmac.toString(), "utf-8");
            const generatedHash = Buffer.from(crypto.createHmac("sha256", apiSecret).update(message).digest("hex"), "utf-8");
            let hashEquals = false;
            try {

                hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
            } catch (e) {
                hashEquals = false;
            }

            if (!hashEquals) {
                
             }

            let accessToken = await getAccessToken(shop, code);

            if (accessToken) {
                console.log(accessToken, "accessToken");
                let storeData = await getShopifyStoreData(shop, accessToken);
                if (storeData) {
                    let response = await saveStoreData(storeData, shop, accessToken);
                    return res.redirect(`${CLIENT_URL}/config/${shop}`);
                }
            }

        } else {

            res.json(respondNotAcceptable("Required parameters are missing"));
        }
    }
    catch (error) {
        res.json(respondInternalServerError("Something went wrong try after sometime"));

    }
};

/**
 * Method to save store details in DB
 * @param {*} shopData 
 * @param {*} shop 
 * @param {*} accessToken 
 * @returns 
 */
let saveStoreData = async (shopData, shop, accessToken) => {
    try {
        const data = {
            name: shopData.shop.name,
            email: shopData.shop.email,
            store_url: shop.toString(),
            access_token: accessToken,
            country_code: shopData.shop?.country_code.toLowerCase()
        };
        console.log(data);
        const storeObj = await store.findOne({
            store_url: data.store_url
        });
        console.log(storeObj)
        if (storeObj) {
            await store.update({ store_url: shop.toString() }, data)
        } else {
            await store.create(data);
        }
        return true;
    }
    catch (error) {
        res.json(respondInternalServerError("Something went wrong try after sometime"));

    }
}

/**
 * Method to get store details
 * @param {*} shop 
 * @param {*} accessToken 
 * @returns 
 */
let getShopifyStoreData = async (shop, accessToken) => {
    try {
        let API_VERSION = process.env.API_VERSION;
        const shopOption = {
            method: "GET",
            url: `https://${shop}/admin/api/${API_VERSION}/shop.json?fields=name,email,city,country_code`,
            headers: {
                "X-Shopify-Access-Token": accessToken
            }
        }
        let shopData = await axios(shopOption);
        console.log(shopData.data, "shopData");

        shopData = (shopData.status == 200 || shopData.status == 201) ? shopData.data : false;

        return shopData;
    }
    catch (error) {
        res.json(respondInternalServerError("Something went wrong try after sometime"));
    }
}

/**
 * Method to get access token of stores
 * @param {*} shop 
 * @param {*} code 
 * @returns 
 */
let getAccessToken = async (shop, code) => {
    try {
        const apiKey = process.env.SHOPIFY_API_KEY;
        const apiSecret = process.env.SHOPIFY_API_SECRET;
        const options = {
            method: "POST",
            url: `https://${shop}/admin/oauth/access_token`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {

                client_id: apiKey,
                client_secret: apiSecret,
                code: code,
            }
        };
        console.log(options, "access token");
        let accessToken = await axios(options);

        accessToken = (accessToken.status == 200 || accessToken.status == 201) ? accessToken.data.access_token : false;

        return accessToken;
    }
    catch (error) {
        res.json(respondInternalServerError("Something went wrong try after sometime"));

    }
}


/**
* Check and update weebhook
* @param {*} req 
* @param {*} res 
*/
const checkWebhooks = async () => {

    try {

        const webhooksList = [
            { "topic": "customers/data_request", endpoint: "/gdpr/customer/data" },
            { "topic": "customers/redact", endpoint: "/gdpr/customer/delete" },
            { "topic": "shop/redact", endpoint: "/gdpr/store/delete" },
            { "topic": "orders/created", endpoint: "/gdpr/store/delete" },
            { "topic": "orders/updated", endpoint: "/gdpr/store/delete" },
            { "topic": "orders/cancelled", endpoint: "/gdpr/store/delete" }

        ];
        const AccessToken = process.env.ACCESS_TOKEN;
        const URL = `https://${process.env.STORE}/admin/api/${process.env.API_VERSION}/webhooks.json`;
        const result = await request({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": `${AccessToken}`,
            },
            url: URL
        }).then(response => JSON.parse(response));

        //console.log(result.webhooks);
        for (const iterator of webhooksList) {

            const flag = result.webhooks.find((item) => item.topic == iterator.topic);
            if (!flag) {
                console.log(iterator);
                const config = {
                    method: "POST",
                    url: URL,
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Access-Token": `${AccessToken}`
                    },
                    data: {
                        "webhook": {
                            "topic": iterator.topic,
                            "address": `${process.env.DOMAIN}${iterator.endpoint}`,
                            "format": "json"
                        }
                    }
                };
                await axios(config)
                    .catch((err) => {
                        console.log("-------error in creating webhook-----", err.data);
                    });
            }
        }
    } catch (err) {

        console.log(err);
    }
}

module.exports = {
    install,
    installCallback
}