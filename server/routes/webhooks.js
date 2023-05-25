const verifyShopifyHook = require('../helper/validator');
const webhookRoute = require('express').Router();

webhookRoute.post('/ordercreated',verifyShopifyHook , ordercraeted);

