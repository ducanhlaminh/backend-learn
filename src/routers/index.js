const { notFound } = require("../helper/handle_error");
const articlesRoutes = require("../modules/news/routes/articles");
const categoriesRouter = require("../modules/news/routes/category");
const authRoutes = require("../modules/users/routes/auth");
const initWebRoutes = (app) => {
    app.use("/api/v1/articles", articlesRoutes);
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/categories", categoriesRouter);
    app.use(notFound);
};

module.exports = initWebRoutes;
