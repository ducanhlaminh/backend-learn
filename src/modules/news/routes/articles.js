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

articlesRoutes.post(
        "/",
        // checkManager,
        uploadFileServer.single("avatar"),
        articlesController.create_articles.createArticleControllers
);
articlesRoutes.post(
        "/hot-main",
        // checkManager,
        articlesController.create_articles.createHotMainController
);
articlesRoutes.post(
        "/hot-cate",
        checkManager,
        articlesController.create_articles.createHotCateController
);

articlesRoutes.put(
        "/hot-main/:id",
        // checkManager,
        articlesController.update_articles.updateHotMainController
);
articlesRoutes.put(
        "/hot-cate/:id",
        // checkManager,
        articlesController.update_articles.updateHotCateController
);
// articlesRoutes.put(
//         "/:id",
//         // checkManager,
//         articlesController.update_articles.publishController
// );

// insert data
articlesRoutes.get(
        "/insert",
        checkManager,
        articlesController.insert.insertData
);
articlesRoutes.get(
        "/publishAll",
        checkManager,
        articlesController.insert.publishData
);

// Admin
articlesRoutes.use(checkToken);
articlesRoutes.get(
        "/get-all",
        articlesController.get_articles.getAllController
);
articlesRoutes.delete("/hot-main", articlesController.delete.deleteHotMain);

module.exports = articlesRoutes;
