const express = require("express");
const categoryRoutes = express.Router();
const categoryControllers = require("../controller/category");

categoryRoutes.post("/", categoryControllers.createCategoryControllers);
categoryRoutes.get("/:id", categoryControllers.getCateById);
module.exports = categoryRoutes;
