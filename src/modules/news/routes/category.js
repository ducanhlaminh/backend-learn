const express = require("express");
const categoryRoutes = express.Router();
const categoryControllers = require("../newControllers/category");

categoryRoutes.post("/", categoryControllers.createCategoryControllers);
categoryRoutes.get("/get-all", categoryControllers.getAll);
categoryRoutes.get("/sub-cate/:slug_crc", categoryControllers.getSubCate);

module.exports = categoryRoutes;
