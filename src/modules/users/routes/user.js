const express = require("express");
const userRouters = express.Router();
const userControllers = require("../userControllers/userControllers");
const { checkToken } = require("../../../middlewares/checkToken");

userRouters.get("/get-data", checkToken, userControllers.getUser);

module.exports = userRouters;
