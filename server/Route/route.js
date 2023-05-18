const { Router } = require("express");
const {validateApi} = require("../helper/validator");

const Route = Router();

Router.post('/installation');

module.exports = Route;