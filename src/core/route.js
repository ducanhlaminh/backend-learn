const articlesRouter = require("../modules/articles/router/article");
const usersRouter = require("../modules/users/router/userRouter");
const categoriesRouter = require("../modules/categories/router/category");
const middleware = require("../middleware");
const listRoutes = [
        {
                path: "/api/v1/articles",
                controller: articlesController,
                middleware: middleware,
                method: "GET",
        },
        {
                path: "/api/v1/articles",
                controller: articlesController,
                middleware: middleware,
                method: "POST",
        },
];
