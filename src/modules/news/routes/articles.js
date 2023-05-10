const express = require("express");
const articlesRoutes = express.Router();
const articlesController = require("../newControllers/articlesController");

articlesRoutes.get("/", articlesController.getAllControllers);
articlesRoutes.get(
      "/cate/:slug/:slug_crc",
      articlesController.getByCateControllers
);
articlesRoutes.get("/:slug/:slug_crc", articlesController.getDetailControllers);
articlesRoutes.post("/title", articlesController.getByTitleControllers);
articlesRoutes.post("/", articlesController.createArticleControllers);
articlesRoutes.post("/hot-main", articlesController.setHotNewsMainController);
articlesRoutes.put("/:id", articlesController.publishController);

module.exports = articlesRoutes;
