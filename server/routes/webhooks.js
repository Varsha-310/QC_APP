import { Router } from 'express';
import {verifyShopifyHook} from '../helper/validator';
const { ordercreated, orderupdated,orderdeleted } = require('../controllers/webhookController');
const { appUninstalled } = require('../controllers/shopifyController');

const webhookRoute = Router();

webhookRoute.post('/ordercreated',verifyShopifyHook , ordercreated);

webhookRoute.post('/orderupdated',verifyShopifyHook , orderupdated);

webhookRoute.post('/orderdeleted',verifyShopifyHook , orderdeleted);

webhookRoute.post('/appuninstalled' , verifyShopifyHook, appUninstalled);

module.exports = webhookRoute

