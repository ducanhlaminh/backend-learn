const express = require("express");
const articlesRoutes = express.Router();
const articlesController = require("../newControllers/articlesController");
// articlesRoutes.use(checkToken);
articlesRoutes.get(
        "/hot-main",
        articlesController.get_articles.getHotControllers
);
articlesRoutes.get(
        "/cate/:slug/:slug_crc",
        articlesController.get_articles.getByCateControllers
);
articlesRoutes.get(
        "/hot-cate/",
        articlesController.get_articles.getHotCategoryController
);
articlesRoutes.get(
        "/publish_at",
        articlesController.get_articles.getByPublishAtController
);
articlesRoutes.get(
        "/:slug/:slug_crc",
        articlesController.get_articles.getDetailControllers
);
articlesRoutes.get(
        "/views",
        articlesController.get_articles.getByViewsController
);
articlesRoutes.get(
        "/title",
        articlesController.get_articles.getByTitleControllers
);
articlesRoutes.get(
        "/box-category",
        articlesController.get_articles.getBoxCategoryControllers
);

module.exports = articlesRoutes;
