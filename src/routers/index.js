const articlesRoutes = require("../modules/news/articles/routes/articles");
const categoriesRouter = require("../modules/news/categories/routes/category");
const initWebRoutes = (app) => {
        app.use("/api/v1/articles", articlesRoutes);
        // app.use("/api/v1/users", usersRouter);
        app.use("/api/v1/categories", categoriesRouter);
};

module.exports = initWebRoutes;
