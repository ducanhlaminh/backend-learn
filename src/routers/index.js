const { notFound, errHandler } = require("../helper/handle_error");
const articlesRoutes = require("../modules/news/routes/articles");
const categoriesRouter = require("../modules/news/routes/category");
const authRoutes = require("../modules/auth/authRoute/auth");
const userRouters = require("../modules/users/routes/user");
const adminRoutes = require("../modules/users/routes/admin");
const initWebRoutes = (app) => {
        app.use("/api/v1/articles", articlesRoutes);
        app.use("/api/v1/auth", authRoutes);
        app.use("/api/v1/categories", categoriesRouter);
        app.use("/api/v1/users", userRouters);
        app.use("/api/v1/admin", adminRoutes);
        app.use(notFound);
        app.use(errHandler);
};

module.exports = initWebRoutes;
