const express = require("express");
const categoryRoutes = express.Router();
const categoryControllers = require("../newControllers/category");

categoryRoutes.post("/", categoryControllers.createCategoryControllers);
categoryRoutes.get("/get-all", categoryControllers.getAll);

module.exports = categoryRoutes;
