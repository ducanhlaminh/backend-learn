const express = require("express");
const adminRoutes = express.Router();
const { checkToken, checkManager } = require("../../../middlewares/checkToken");
const adminControllers = require("../userControllers/adminControllers");
const uploadFileServer = require("../../../uploadFile/multer");
// adminRoutes.use(checkToken);

adminRoutes.get("/articles", adminControllers.get_articles.getAllController);

adminRoutes.post(
        "/articles",
        uploadFileServer.single("avatar"),
        adminControllers.create_articles.createArticleControllers
);
adminRoutes.post(
        "/hot-main",
        adminControllers.create_articles.createHotMainController
);
adminRoutes.post(
        "/hot-cate",
        adminControllers.create_articles.createHotCateController
);
adminRoutes.put(
        "/hot-main/:id",
        adminControllers.update_articles.updateHotMainController
);
adminRoutes.put(
        "/articles",
        uploadFileServer.single("avatar"),
        adminControllers.update_articles.publishController
);
adminRoutes.put(
        "/hot-cate/:id",
        adminControllers.update_articles.updateHotCateController
);

// insert data
adminRoutes.get("/insert", adminControllers.insert.insertData);
adminRoutes.get(
        "/publishAll",
        checkManager,
        adminControllers.insert.publishData
);

adminRoutes.delete("/hot-main", adminControllers.delete.deleteHotMain);
adminRoutes.delete("/hot-cate", adminControllers.delete.deleteHotCate);
adminRoutes.delete(
        "/articles",
        adminControllers.delete.deleteArticleController
);

adminRoutes.get("/user", adminControllers.user.getAllController);
adminRoutes.post("/user", adminControllers.user.createdController);
module.exports = adminRoutes;
