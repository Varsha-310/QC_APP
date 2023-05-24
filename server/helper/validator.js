const Validator = require('validatorjs');

// created validator for Api
const validator = async (body, rules, customMessages, callback) => {

    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

/**
 * Validation for send otp API
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const validateApi = async (req, res, next) => {

    const validationRule = {
        "name": "required|string"
    };
    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.send(err);
        } else {
            next();
        }
    }).catch(err => {
        console.log(err);
    });
}

/**
 * compare received and generated hash to verify the webhook
 * @param req 
 * @returns boolean
 */
const verifyShopifyHook = async(req, res ,next) => {
    try {

        const api_secret = process.env.SHOPIFY_API_SECRET ?? "";
        const body = req.rawBody;
        const digest = crypto.createHmac('sha256', api_secret).update(body).digest('base64');
        const providedHmac = req.headers['x-shopify-hmac-sha256']?.toString();
    
        if(digest == providedHmac){
            next();
        }else{

            res.sendStatus(HttpStatusCode.AUTHORIZATION);
        }
    } catch (e) {
        res.sendStatus(HttpStatusCode.AUTHORIZATION);
    }
}

module.exports = {
    validateApi,
    verifyShopifyHook
}