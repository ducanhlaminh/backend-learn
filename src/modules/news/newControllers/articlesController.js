const articlesService = require("../newServices/articlesService");
const { articels } = require("../../../untils/dataDemo");
const articlesController = {
        get_articles: {
                getHotCategoryController: async (req, res) => {
                        const hotArticlesCate =
                                await articlesService.getHotCategoryService(
                                        req.query.slug_crc
                                );
                        const boxSubCate =
                                await articlesService.getHotBoxSubCategoryService(
                                        req.query.slug_crc
                                );
                        res.status(200).json({ hotArticlesCate, boxSubCate });
                },
                getHotSubCategoryController: async (req, res) => {
                        const box =
                                await articlesService.getHotBoxSubCategoryService(
                                        req.query.slug_crc
                                );
                        res.status(200).json({ box });
                },
                getHotControllers: async (req, res) => {
                        const hot_news = await articlesService.getHotService();
                        res.status(200).json({ hot_news });
                },
                getByTitleControllers: async (req, res) => {
                        const response =
                                await articlesService.getByTitleService(
                                        req.body.title
                                );
                        res.send(response);
                },
                getByCateControllers: async (req, res) => {
                        const response = await articlesService.getByCateService(
                                req.params.slug,
                                req.params.slug_crc
                        );
                        res.status(200).json(response);
                },
                getDetailControllers: async (req, res) => {
                        const response = await articlesService.getDetailService(
                                req.params.slug,
                                req.params.slug_crc
                        );
                        res.status(200).json(response);
                },
                getByViewsController: async (req, res) => {
                        const views_news = await articlesService.getByMostView(
                                req.query.slug_crc
                        );
                        res.status(200).json(views_news);
                },
                getByPublishAtController: async (req, res) => {
                        const news = await articlesService.getByPublishAt(
                                req.query.slug,
                                req.query.text
                        );
                        res.status(200).json({ newArticleCate: news });
                },
        },
        update_articles: {
                publishController: async (req, res) => {
                        const response = await articlesService.publishService(
                                req.params.id
                        );
                        res.status(200).json(response);
                },
                updateHotMainController: async (req, res) => {
                        const response = await articlesService.updateHotMain(
                                req.body,
                                req.params.id
                        );
                        res.status(200).json(response);
                },
        },
        create_articles: {
                createArticleControllers: async (req, res) => {
                        const response =
                                await articlesService.createArticleService(
                                        req.body
                                );
                        res.status(200).json(response);
                },
                createHotMainController: async (req, res) => {
                        const response = await articlesService.createHotMain(
                                req.body
                        );
                        res.status(200).json(response);
                },
                createHotCateController: async (req, res) => {
                        const response = await articlesService.createHotCate(
                                req.body
                        );
                        res.status(200).json(response);
                },
        },
        insertData: async (req, res) => {
                const response = await articlesService.insertDataService(
                        articels
                );
                res.status(200).json(response);
        },
        publishData: async (req, res) => {
                const response = await articlesService.pushlishedAllService();
                res.status(200).json(response);
        },
};

module.exports = articlesController;
