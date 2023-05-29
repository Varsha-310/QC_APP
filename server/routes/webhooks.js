import { Router } from 'express';
import {verifyShopifyHook} from '../helper/validator';
const { ordercraeted, orderupdated,orderdeleted } = require('../controllers/webhookController');
const { appUninstalled } = require('../controllers/shopifyController');

const webhookRoute = Router();

webhookRoute.post('/ordercreated',verifyShopifyHook , ordercraeted);

webhookRoute.post('/orderUpdated',verifyShopifyHook , orderupdated);

webhookRoute.post('/orderdeleted',verifyShopifyHook , orderdeleted);

webhookRoute.post('/appUninstalled' , verifyShopifyHook, appUninstalled);

module.exports = webhookRoute

