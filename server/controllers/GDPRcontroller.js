/**
 * webhook to handle show user details
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserDetails = (req, res) => {
    return res.status(200).json({});
}


/**
 * webhook to handle delete user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteUserData = (req, res) => {
    return res.sendStatus(200);
}


/**
 * webhook to handle delete store data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteStoreData = (req, res) => {
    return res.sendStatus(200);
}

module.exports = {
    getUserDetails,
    deleteUserData,
    deleteStoreData
}




