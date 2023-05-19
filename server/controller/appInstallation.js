const axios = require('axios');

/**
 * method for installation method
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const install = async (req, res) => {

    const shop = req.query.shop;
    if (shop) {
        logger.info(`Installation: Request Initiated for store - ${shop}`);
        const scopes = process.env.SCOPES;
        const apiKey = process.env.SHOPIFY_API_KEY;
        const APP_URL = process.env.APP_URL;
        const state = Date.now();
        const redirectUri = `${APP_URL}/api/v1/callback`;
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
export const installCalback = async (req, res) => {

    const { shop, hmac, code, state } = req.query;
    logger.info(`Installation:  Callback Method callled for store - ${shop}`);
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
        delete query["signature"];
        delete query["hmac"];
        const message = new URLSearchParams(query).toString();
        const providedHmac = Buffer.from(hmac.toString(), "utf-8");
        const generatedHash = Buffer.from(crypto.createHmac("sha256", apiSecret).update(message).digest("hex"), "utf-8");
        let hashEquals = false;
        try {

            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
        } catch (e) {

            logger.error({ shop, e });
            hashEquals = false;
        }

        if (!hashEquals) {
            logger.info(`Installation: HMAC missmatched - store - ${shop}`);
            return res.status(400).json({ msg: "HMAC validation failed" });
        }

        try {

            // DONE: Exchange temporary code for a permanent access token
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
            const accessToken = await axios(options)
            // .then((resp: AxiosResponse) =>  resp.data.access_token)
            // .catch((error) => {
            //     throw new BaseError(`Generate Access Token:${shop}`, HttpStatusCode.INTERNAL_SERVER, `Encountered error during generate token- ${error.message}`, "E002");
            // });

            // get shop details from shopify
            const shopOption = {
                method: "GET",
                url: `https://${shop}/admin/api/${API_VERSION}/shop.json?fields=name,email,city,country_code`,
                headers: {
                    "X-Shopify-Access-Token": accessToken
                }
            }
            const shopData = await axios(shopOption)
            // .then((resp: AxiosResponse) => resp.data)
            // .catch((error) => {
            //     throw new BaseError(`Fetch Shop Details:${shop}`, HttpStatusCode.INTERNAL_SERVER, `Encountered error during fetch shop details- ${error.message}`, "E002");
            // });

            // create store json
            const data = {
                name: shopData.shop.name,
                email: shopData.shop.email,
                store_url: shop.toString(),
                access_token: accessToken,
                country_code: shopData.shop?.country_code.toLowerCase(),
                status: true
            };
            //console.log(data);
            try {

                const storeObj = await storeRepo.findBy({
                    store_url: data.store_url
                });
                if (storeObj.length) {

                    await storeRepo.update({ store_url: shop.toString() }, data)
                } else {

                    await storeRepo.save(data);
                }
                logger.info(`Installation: Shop details updated successfully.- store - ${shop}`);
                return res.redirect(`${CLIENT_URL}/config/${shop}`);
            } catch (error) {

                throw new BaseError(`Store Shop Details:${shop}`, HttpStatusCode.INTERNAL_SERVER, `Error during update shop details`, "E002");
            }
        } catch (error) {

            logger.info(`Installation: Internal server error found - store - ${shop}`);
            return next(error);
        }
    } else {

        logger.info(`Installation: Required paramter messing - store - ${shop}`);
        return res.status(HttpStatusCode.VALIDATION).send("Required parameters missing");
    }

};

