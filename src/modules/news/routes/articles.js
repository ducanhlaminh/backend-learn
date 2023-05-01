const express = require("express");
const articlesRoutes = express.Router();
const articlesController = require("../newControllers/articlesController");

articlesRoutes.get("/", articlesController.getAllControllers);
articlesRoutes.get("/cate/:id", articlesController.getByCateControllers);
articlesRoutes.post("/title", articlesController.getByTitleControllers);
articlesRoutes.post("/", articlesController.createArticleControllers);
module.exports = articlesRoutes;
