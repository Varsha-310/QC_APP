import { Router } from 'express';
import { getUserDetails, deleteStoreData, deleteUserData } from '../controllers/gdprController';

const gdprRoute = Router();

// gdpr api to get customer data
gdprRoute.post('/customer/data', getUserDetails);

// gdpr api to delete customer data
gdprRoute.post('/customer/delete', deleteUserData);

// gdpr api to delete store data
gdprRoute.post('/store/delete', deleteStoreData);

export default gdprRoute;