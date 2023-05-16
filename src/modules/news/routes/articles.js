const express = require("express");
const articlesRoutes = express.Router();
const articlesController = require("../newControllers/articlesController");

articlesRoutes.get("/", articlesController.getHotControllers);
articlesRoutes.get(
      "/cate/:slug/:slug_crc",
      articlesController.getByCateControllers
);
articlesRoutes.get("/:slug/:slug_crc", articlesController.getDetailControllers);
articlesRoutes.get("/publish_at", articlesController.getByPublishAtController);
articlesRoutes.get("/views", articlesController.getByViewsController);

articlesRoutes.post("/title", articlesController.getByTitleControllers);
articlesRoutes.post("/", articlesController.createArticleControllers);
articlesRoutes.post("/hot-main", articlesController.createHotMainController);
articlesRoutes.post("/hot-cate", articlesController.createHotCateController);

articlesRoutes.put("/hot-main/:id", articlesController.updateHotMainController);
articlesRoutes.put("/:id", articlesController.publishController);

module.exports = articlesRoutes;
