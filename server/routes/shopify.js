const shopifyRoute = require('express').Router();
const { install, installCallback } = require('../controllers/shopifyController');

// Route of app installation
shopifyRoute.get('/install', install);

// Route of app installation callback
shopifyRoute.get('/callback', installCallback);

module.exports = shopifyRoute;
