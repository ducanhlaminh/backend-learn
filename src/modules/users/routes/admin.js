const express = require("express");
const adminRoutes = express.Router();
const { checkToken, checkManager } = require("../../../middlewares/checkToken");
const adminControllers = require("../userControllers/adminControllers");
const uploadFileServer = require("../../../uploadFile/multer");
adminRoutes.use(checkToken);

adminRoutes.get("/user", adminControllers.user.getAllController);
adminRoutes.post("/user", adminControllers.user.createdController);
module.exports = adminRoutes;
