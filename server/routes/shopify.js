const router = require('express').Router();
const { install,installCallback } = require('../controllers/shopifyController');

router.get('/install', install);
router.get('/callback', installCallback);

module.exports = router;
