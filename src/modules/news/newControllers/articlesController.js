const articlesService = require("../newServices/articlesService");
const { articels } = require("../../../untils/dataDemo");
const articlesController = {
        get_articles: {
                getAllController: async (req, res) => {
                        const response =
                                await articlesService.get.getAllService(
                                        req.query
                                );
                        res.status(200).json(response);
                },
                getHotCategoryController: async (req, res) => {
                        const hotArticlesCate =
                                await articlesService.get.getHotCategoryService(
                                        req.query.slug_crc
                                );
                        const boxSubCate =
                                await articlesService.get.getHotBoxSubCategoryService(
                                        req.query.slug_crc
                                );
                        res.status(200).json({ hotArticlesCate, boxSubCate });
                },
                getHotSubCategoryController: async (req, res) => {
                        const box =
                                await articlesService.get.getHotBoxSubCategoryService(
                                        req.query.slug_crc
                                );
                        res.status(200).json({ box });
                },
                getHotControllers: async (req, res) => {
                        const hot_news =
                                await articlesService.get.getHotService();
                        res.status(200).json({ hot_news });
                },
                getByTitleControllers: async (req, res) => {
                        const response =
                                await articlesService.get.getByTitleService(
                                        req.query.title,
                                        req.query.category_id
                                );
                        res.status(200).json(response);
                },
                getByCateControllers: async (req, res) => {
                        const response =
                                await articlesService.get.getByCateService(
                                        req.params.slug,
                                        req.params.slug_crc
                                );
                        res.status(200).json(response);
                },
                getDetailControllers: async (req, res) => {
                        const response =
                                await articlesService.get.getDetailService(
                                        req.params.slug,
                                        req.params.slug_crc
                                );
                        res.status(200).json(response);
                },
                getByViewsController: async (req, res) => {
                        const views_news =
                                await articlesService.get.getByMostView(
                                        req.query.slug_crc
                                );
                        res.status(200).json(views_news);
                },
                getByPublishAtController: async (req, res) => {
                        const news = await articlesService.get.getByPublishAt(
                                req.query.slug,
                                req.query.text
                        );
                        res.status(200).json({ newArticleCate: news });
                },
        },
        update_articles: {
                publishController: async (req, res) => {
                        const response =
                                await articlesService.update.publishService(
                                        req.params.id
                                );
                        res.status(200).json(response);
                },
                updateHotMainController: async (req, res) => {
                        const response =
                                await articlesService.update.updateHotMain(
                                        req.body,
                                        req.params.id
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
                        const response =
                                await articlesService.create.createHotMain(
                                        req.body.data
                                );
                        res.status(200).json(response);
                },
                createHotCateController: async (req, res) => {
                        const response =
                                await articlesService.create.createHotCate(
                                        req.body
                                );
                        res.status(200).json(response);
                },
        },
        delete: {
                deleteHotMain: async (req, res) => {
                        const response =
                                await articlesService.delete.deleteHotMainService(
                                        req.query
                                );
                        return res.status(200).json(response);
                },
        },
        insert: {
                insertData: async (req, res) => {
                        const response =
                                await articlesService.insert.insertDataService(
                                        articels
                                );
                        res.status(200).json(response);
                },
                publishData: async (req, res) => {
                        const response =
                                await articlesService.insert.pushlishedAllService();
                        res.status(200).json(response);
                },
        },
};

module.exports = articlesController;
