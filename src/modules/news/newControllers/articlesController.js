const articlesService = require("../newServices/articlesService");
const asyncHandler = require("express-async-handler");
const articlesController = {
    guest: {
        get_articles: {
            getHotCategoryController: asyncHandler(async (req, res) => {
                let hotArticlesCate =
                    await articlesService.guest.get.getHotCategoryService(
                        req.query.slug_crc
                    );
                const boxSubCate =
                    await articlesService.guest.get.getHotBoxSubCategoryService(
                        req.query.slug_crc
                    );
                if (hotArticlesCate === null) {
                    hotArticlesCate = {};
                    hotArticlesCate.new_articles_hot_categories = [];
                }
                res.status(200).json({ hotArticlesCate, boxSubCate });
            }),
            getHotSubCategoryController: asyncHandler(async (req, res) => {
                const box =
                    await articlesService.guest.get.getHotBoxSubCategoryService(
                        req.query.slug_crc
                    );
                res.status(200).json({ box });
            }),
            getHotControllers: asyncHandler(async (req, res) => {
                const hot_news =
                    await articlesService.guest.get.getHotService();
                res.status(200).json({ hot_news });
            }),
            getByTitleControllers: asyncHandler(async (req, res) => {
                console.log(req.query);
                const response =
                    await articlesService.guest.get.getByTitleService(
                        req.query
                    );
                res.status(200).json(response);
            }),
            getByCateControllers: asyncHandler(async (req, res) => {
                const response =
                    await articlesService.guest.get.getByCateService(
                        req.params.slug,
                        req.params.slug_crc
                    );
                res.status(200).json(response);
            }),
            getDetailControllers: asyncHandler(async (req, res) => {
                const response =
                    await articlesService.guest.get.getDetailService(
                        req.params.slug,
                        req.params.slug_crc
                    );
                res.status(200).json(response);
            }),
            getByViewsController: asyncHandler(async (req, res) => {
                const views_news =
                    await articlesService.guest.get.getByMostView(
                        req.query.slug_crc
                    );
                res.status(200).json(views_news);
            }),
            getByPublishAtController: asyncHandler(async (req, res) => {
                const news = await articlesService.guest.get.getByPublishAt(
                    req.query
                );
                res.status(200).json({ newArticleCate: news });
            }),
            getBoxCategoryControllers: asyncHandler(async (req, res) => {
                const box =
                    await articlesService.guest.get.getHotBoxSubCategoryService(
                        req.query?.slug_crc
                    );
                res.status(200).json({ box });
            }),
        },
    },
    admin: {
        get_articles: {
            getAllController: async (req, res) => {
                console.log("okkk");
                const response = await articlesService.admin.get.getAllService({
                    ...req.query,
                    role_id: req?.user?.role,
                });
                res.status(200).json(response);
            },
        },
        update_articles: {
            publishController: async (req, res) => {
                if (req.query.id) {
                    var response =
                        await articlesService.update.publishArticlesSer(
                            req.query.id,
                            req.body.data
                        );
                    res.status(200).json(response);
                }
                // const file = req.file;
                // const response =
                //         await articlesService.update.updateArticleService(
                //                 req.params.id,
                //                 req.body,
                //                 file
                //         );
            },
            updateHotMainController: async (req, res) => {
                const response =
                    await articlesService.admin.update.updateHotMain(req.body);
                res.status(200).json(response);
            },
            updateHotCateController: async (req, res) => {
                const response = await articlesService.update.updateHotCate(
                    req.body,
                    req.params.category_id
                );
                res.status(200).json(response);
            },
        },
        create_articles: {
            createArticleControllers: async (req, res) => {
                const file = req.file;
                const response =
                    await articlesService.create.createArticleService(
                        file,
                        req.body
                    );
                res.status(200).json(response);
            },
            createHotMainController: async (req, res) => {
                const response = await articlesService.create.createHotMain(
                    req.body.data
                );
                res.status(200).json(response);
            },
            createHotCateController: async (req, res) => {
                const response = await articlesService.create.createHotCate(
                    req.body
                );
                res.status(200).json(response);
            },
        },
        delete: {
            deleteArticleController: async (req, res) => {
                const response =
                    await articlesService.delete.deleteArticleService(
                        req.query.id
                    );
                return res.status(200).json(response);
            },
            deleteHotMain: async (req, res) => {
                const response =
                    await articlesService.delete.deleteHotMainService(
                        req.query
                    );
                return res.status(200).json(response);
            },
            deleteHotCate: async (req, res) => {
                const response =
                    await articlesService.delete.deleteHotCateService(
                        req.query
                    );
                return res.status(200).json(response);
            },
        },
    },

    getAvatarController: asyncHandler(async (req, res) => {
        const avatar = await articlesService.guest.get.getAvatarService(
            req?.query
        );
        res.send(avatar);
    }),
};

module.exports = articlesController;
