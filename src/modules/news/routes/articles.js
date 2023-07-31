const express = require("express");
const articlesRoutes = express.Router();
const { checkToken, checkManager } = require("../../../middlewares/checkToken");
const articlesController = require("../newControllers/articlesController");
const uploadFileServer = require("../../../uploadFile/multer");
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

module.exports = articlesRoutes;
