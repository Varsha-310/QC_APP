const gdprRoute =require('express').Router();
import {getUserDetails, deleteStoreData, deleteUserData} from '../controllers/gdprController/'

gdprRoute.post('/customer/data', getUserDetails);
gdprRoute.post('/customer/delete', deleteUserData);
gdprRoute.post('/store/delete', deleteStoreData);

export default gdprRoute;