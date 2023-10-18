const express = require("express");
const articlesRoutes = express.Router();
const articlesController = require("../newControllers/articlesController");

// Publish routes

articlesRoutes.get(
        "/hot-main",
        articlesController.get_articles.getHotControllers
);
articlesRoutes.get("/avatar", articlesController.getAvatarController);
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

// Insert data

// adminRoutes.get("/insert", adminControllers.insert.insertData);
// Admin routes

module.exports = articlesRoutes;
