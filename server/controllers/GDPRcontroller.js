const { respondSuccess } = require("./helper/response");

/**
 * webhook to handle show user details
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserDetails = (req, res) => {
    res.json(respondSuccess("webhook received"));
}

/**
 * webhook to handle delete user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteUserData = (req, res) => {
    res.json(respondSuccess("webhook received"));
}


/**
 * webhook to handle delete store data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteStoreData = (req, res) => {
    res.json(respondSuccess("webhook received"));
}

module.exports = {
    getUserDetails,
    deleteUserData,
    deleteStoreData
}




