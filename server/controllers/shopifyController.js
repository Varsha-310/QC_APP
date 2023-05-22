const axios = require('axios');
const store = require("../models/store");

/**
 * method for installation method
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 const install = async (req, res) => {

    const shop = req.query.shop;
    if (shop) {
        // logger.info(`Installation: Request Initiated for store - ${shop}`);
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
};

/**
 * method for installation callback
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const installCallback = async (req, res) => {

    const { shop, hmac, code, state } = req.query;
    const apiSecret = process.env.SHOPIFY_API_SECRET ?? "";
    const CLIENT_URL = process.env.CLIENT_URL ?? "";
    const apiKey = process.env.SHOPIFY_API_KEY ?? "";
    const API_VERSION = process.env.API_VERSION ?? "";
    // const stateCookie = cookie.parse(headersCookies).state;
    // if (state !== stateCookie) {
    //     return res.status(403).send('Request origin cannot be verified');
    // }
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

        // try {
           
            let accessToken = await getAccessToken(shop,code);

            if(accessToken) {
                console.log(accessToken,"accessToken");
                let storeData = await getShopifyStoreData(shop,accessToken);
                if(storeData) {
                    let response = await saveStoreData(storeData,shop,accessToken);
                    return res.redirect(`${CLIENT_URL}/config/${shop}`);
                }
            }    
        // } catch (error) {
        //     // console.log(error);
        //     // logger.info(`Installation: Internal server error found - store - ${shop}`);
        //     // return next(error);
        // }
    } else {

        return res.status(HttpStatusCode.VALIDATION).send("Required parameters missing");
    }
};


let saveStoreData = async (shopData,shop,accessToken)  => {
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

let getShopifyStoreData = async (shop,accessToken) => {
    let API_VERSION = process.env.API_VERSION;
    const shopOption = {
        method: "GET",
        url: `https://${shop}/admin/api/${API_VERSION}/shop.json?fields=name,email,city,country_code`,
        headers: {
            "X-Shopify-Access-Token": accessToken
        }
    }
    let shopData = await axios(shopOption);
    console.log(shopData.data,"shopData");

    shopData = (shopData.status == 200 || shopData.status == 201)?shopData.data:false;

    return shopData;

}

let getAccessToken = async (shop,code) => {
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
    
    accessToken = (accessToken.status == 200 || accessToken.status == 201)?accessToken.data.access_token:false;

    return accessToken;

}

module.exports = {
    install,
    installCallback
}