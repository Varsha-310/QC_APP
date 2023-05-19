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

module.exports = {
    validateApi
}