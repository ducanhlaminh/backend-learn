const express = require("express");
const adminRoutes = express.Router();
const { checkToken } = require("../../../middlewares/checkToken");
const adminControllers = require("../userControllers/adminControllers");
adminRoutes.use(checkToken);

adminRoutes.get("/user", adminControllers.user.getAllController);
adminRoutes.post("/user", adminControllers.user.createdController);
module.exports = adminRoutes;
