const express = require("express");
const userRouters = express.Router();
const userControllers = require("../userControllers/userControllers");

const { checkToken } = require("../../../middlewares/checkToken");
userRouters.put("/:id", userControllers.admin.updateService);
userRouters.use(checkToken);
userRouters.get("/get-data", userControllers.user.getUser);
// private

userRouters.get("/admin", userControllers.admin.getAllController);
userRouters.post("/admin", userControllers.admin.createdController);

module.exports = userRouters;
