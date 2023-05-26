import { respondSuccess } from "../helper/response";

/**
 * webhook to handle show user details
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getUserDetails = (req, res) => {
    res.json(respondSuccess("webhook received"));
}

/**
 * webhook to handle delete user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */ 
export const deleteUserData = (req, res) => {
    res.json(respondSuccess("webhook received"));
}


/**
 * webhook to handle delete store data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const deleteStoreData = (req, res) => {
    res.json(respondSuccess("webhook received"));
}






