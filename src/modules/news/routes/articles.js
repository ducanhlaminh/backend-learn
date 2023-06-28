const express = require("express");
const articlesRoutes = express.Router();
const { checkToken } = require("../../../middlewares/checkToken");
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
articlesRoutes.post(
    "/",
    articlesController.create_articles.createArticleControllers
);
articlesRoutes.post(
    "/hot-main",
    articlesController.create_articles.createHotMainController
);
articlesRoutes.post(
    "/hot-cate",
    articlesController.create_articles.createHotCateController
);

articlesRoutes.put(
    "/hot-main/:id",
    articlesController.update_articles.updateHotMainController
);
articlesRoutes.put(
    "/:id",
    articlesController.update_articles.publishController
);

// insert data
articlesRoutes.get("/insert", articlesController.insert.insertData);
articlesRoutes.get("/publishAll", articlesController.insert.publishData);
module.exports = articlesRoutes;
