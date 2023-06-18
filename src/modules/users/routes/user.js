const express = require("express");
const userRouters = express.Router();
const userControllers = require("../userControllers/userControllers");
const { checkToken } = require("../../../middlewares/checkToken");
userRouters.use(checkToken);
userRouters.get("/get-data", userControllers.getUser);

module.exports = userRouters;
