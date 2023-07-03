const express = require("express");
const categoryRoutes = express.Router();
const categoryControllers = require("../newControllers/categoryController");

categoryRoutes.post("/", categoryControllers.createCategoryControllers);
categoryRoutes.get("/get-all", categoryControllers.getAll);
categoryRoutes.get("/", categoryControllers.getByName);
categoryRoutes.get("/sub-cate/:slug_crc", categoryControllers.getSubCate);
categoryRoutes.get("/insert", categoryControllers.insertData);
module.exports = categoryRoutes;
