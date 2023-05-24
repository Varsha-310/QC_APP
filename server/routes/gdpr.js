const gdprRoute =require('express').Router();
const {getUserDetails, deleteStoreData, deleteUserData} = require("../controllers/gdprController")

gdprRoute.post('/customer/data', getUserDetails);
gdprRoute.post('/customer/delete', deleteUserData);
gdprRoute.post('/store/delete', deleteStoreData);

export default gdprRoute;