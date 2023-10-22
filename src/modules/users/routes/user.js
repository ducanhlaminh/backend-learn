const express = require("express");
const userRouters = express.Router();
const userControllers = require("../userControllers/userControllers");

const { checkToken } = require("../../../middlewares/checkToken");
userRouters.put("/:id", userControllers.admin.updateService);
userRouters.use(checkToken);
userRouters.get("/get-data", userControllers.user.getUser);
// private

userRouters.get("/user", userControllers.admin.getAllController);
userRouters.post("/user", userControllers.admin.createdController);

module.exports = userRouters;
