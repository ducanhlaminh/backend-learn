const express = require("express");
const articlesRoutes = express.Router();
const articlesController = require("../controller/articlesController");

articlesRoutes.get("/", articlesController.getAllControllers);
articlesRoutes.post("/cate", articlesController.getByCateControllers);
articlesRoutes.post("/title", articlesController.getByTitleControllers);
articlesRoutes.post("/", articlesController.createArticleControllers);
module.exports = articlesRoutes;
