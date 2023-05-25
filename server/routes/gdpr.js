const gdprRoute = require('express').Router();
const { getUserDetails, deleteStoreData, deleteUserData } = require('../controllers/gdprController')

// gdpr api to get customer data
gdprRoute.post('/customer/data', getUserDetails);

// gdpr api to delete customer data
gdprRoute.post('/customer/delete', deleteUserData);

// gdpr api to delete store data
gdprRoute.post('/store/delete', deleteStoreData);

module.exports = gdprRoute;