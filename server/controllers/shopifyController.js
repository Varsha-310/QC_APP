const axios = require('axios');
const store = require("../models/store");

/**
 * method for installation method
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const install = async (req, res) => {
    try {
        const shop = req.query.shop;
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
            return res
                .status(400)
                .send(
                    "Missing shop parameter. Please add ?shop={shop}.myshopify.com to your request"
                );
        }
    }
    catch (error) {
        return res
            .status(500)
            .send(
                "Something went wrong try after sometime!"
            );

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


            // const query: any = Object.assign({}, req.query);
            // delete query["signature"];
            // delete query["hmac"];
            // const message = new URLSearchParams(query).toString();
            // const providedHmac = Buffer.from(hmac.toString(), "utf-8");
            // const generatedHash = Buffer.from(crypto.createHmac("sha256", apiSecret).update(message).digest("hex"), "utf-8");
            // let hashEquals = false;
            // try {

            //     hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
            // } catch (e) {

            //     logger.error({ shop, e });
            //     hashEquals = false;
            // }

            // if (!hashEquals) {
            //     // logger.info(`Installation: HMAC missmatched - store - ${shop}`);
            //     return res.status(400).json({ msg: "HMAC validation failed" });
            // }

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

            return res.status(422).send("Required parameters missing");
        }
    }
    catch (error) {
        return res.status(500).send("something went wrong , try after sometime!");

    }
};

/**
 * 
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
            country_code: shopData.shop?.country_code.toLowerCase(),
            status: true
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
        return res.status(500).send("something went wrong , try after sometime!");

    }
}

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
        return res.status(500).send("something went wrong , try after sometime!");
    }
}

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
        return res.status(500).send("something went wrong , try after sometime!");
    }
}

//resigter webhook
function registerWebhooks_(shopifyAPI, topic) {
    let webhookEndpoint = topic.replace("/", "-");
    let BASE_URL = process.env.BASE_URL;
    let address = `${APP_URL}/webhooks/${webhookEndpoint}/${shopifyAPI.options.shopName}`;
    return shopifyAPI.webhook.create({
        topic: topic,
        address: address,
        format: "json"
    });
}

//check for webhook is registered on not
async function checkWebhookExist(shopifyAPI, topic) {
    var exist = false;
    var webhookList = await shopifyAPI.webhook.list();
    for (var i = 0; i < webhookList.length; i++) {
        if (webhookList.topic === topic) {
            exist = true;
            break;
        }
    }
    return exist;
}

//pass the webhook topic to resigter webhook
async function registerWebhooks(shopifyAPI) {
    var args = [
        "orders/cancelled",
        "orders/create",
        "orders/updated",
        "orders/delete"
    ];
    for (let i = 0; i < args.length; i++) {
        if (await checkWebhookExist(shopifyAPI, args[i])) {
            console.log("webhook exist");
        } else {
            try {
                let result = await registerWebhooks_(shopifyAPI, args[i]);
                console.log(result);
            } catch (err) {
                // console.log(err);
                // console.log('Error; statusCode: ', err.statusCode);
                // break;
            }
        }
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
            { "topic": "collections/update", endpoint: "/api/collectionUpdate" },
            { "topic": "products/update", endpoint: "/api/productsupdated" },
            { "topic": "orders/create", endpoint: "/api/orderwebhook" }
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