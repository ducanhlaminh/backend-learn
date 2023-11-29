const express = require("express");
const articlesRoutes = express.Router();
const articlesController = require("../newControllers/articlesController");
const uploadFileServer = require("../../../uploadFile/multer");
const { checkToken } = require("../../../middlewares/checkToken");
// Publish routes
articlesRoutes.get(
      "/hot-main",
      articlesController.guest.get_articles.getHotControllers
);
articlesRoutes.get("/avatar", articlesController.getAvatarController);
articlesRoutes.get(
      "/cate/:slug/:slug_crc",
      articlesController.guest.get_articles.getByCateControllers
);
articlesRoutes.get(
      "/hot-cate/",
      articlesController.guest.get_articles.getHotCategoryController
);
articlesRoutes.get(
      "/publish_at",
      articlesController.guest.get_articles.getByPublishAtController
);
articlesRoutes.get(
      "/detail/:slug/:slug_crc",
      articlesController.guest.get_articles.getDetailControllers
);
articlesRoutes.get(
      "/views",
      articlesController.guest.get_articles.getByViewsController
);
articlesRoutes.get(
      "/title",
      articlesController.guest.get_articles.getByTitleControllers
);
articlesRoutes.get(
      "/box-category",
      articlesController.guest.get_articles.getBoxCategoryControllers
);

// Insert data

// Admin routes
articlesRoutes.use(checkToken);
articlesRoutes.get(
      "/admin/articles",
      articlesController.admin.get_articles.getAllController
);
articlesRoutes.get(
      "/admin/hot-news",
      articlesController.admin.get_articles.getHotController
);
articlesRoutes.post(
      "/admin/hot-news",
      articlesController.admin.create_articles.createHotController
);
articlesRoutes.post(
      "/admin/articles",
      uploadFileServer.single("avatar"),
      articlesController.admin.create_articles.createArticleControllers
);

articlesRoutes.post(
      "/admin/hot-cate",
      articlesController.admin.create_articles.createHotCateController
);
articlesRoutes.put(
      "/admin/hot-main",
      articlesController.admin.update_articles.updateHotMainController
);
articlesRoutes.put(
      "/admin/articles",
      uploadFileServer.single("avatar"),
      articlesController.admin.update_articles.publishController
);
articlesRoutes.put(
      "/admin/hot-cate/:category_id",
      articlesController.admin.update_articles.updateHotCateController
);

// insert data

articlesRoutes.delete(
      "admin/hot-main",
      articlesController.admin.delete.deleteHotMain
);
articlesRoutes.delete(
      "/admin/hot-cate",
      articlesController.admin.delete.deleteHotCate
);
articlesRoutes.delete(
      "/admin/articles",
      articlesController.admin.delete.deleteArticleController
);

module.exports = articlesRoutes;
