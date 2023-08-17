const articlesService = require("../newServices/articlesService");
const asyncHandler = require("express-async-handler");
const articlesController = {
        get_articles: {
                getAllController: asyncHandler(async (req, res) => {
                        const response =
                                await articlesService.get.getAllService(
                                        req.query
                                );
                        res.status(200).json(response);
                }),
                getHotCategoryController: asyncHandler(async (req, res) => {
                        const hotArticlesCate =
                                await articlesService.get.getHotCategoryService(
                                        req.query.slug_crc
                                );
                        const boxSubCate =
                                await articlesService.get.getHotBoxSubCategoryService(
                                        req.query.slug_crc
                                );
                        res.status(200).json({ hotArticlesCate, boxSubCate });
                }),
                getHotSubCategoryController: asyncHandler(async (req, res) => {
                        const box =
                                await articlesService.get.getHotBoxSubCategoryService(
                                        req.query.slug_crc
                                );
                        res.status(200).json({ box });
                }),
                getHotControllers: asyncHandler(async (req, res) => {
                        const hot_news =
                                await articlesService.get.getHotService();
                        res.status(200).json({ hot_news });
                }),
                getByTitleControllers: asyncHandler(async (req, res) => {
                        const response =
                                await articlesService.get.getByTitleService(
                                        req.query.title,
                                        req.query.category_id
                                );
                        res.status(200).json(response);
                }),
                getByCateControllers: asyncHandler(async (req, res) => {
                        const response =
                                await articlesService.get.getByCateService(
                                        req.params.slug,
                                        req.params.slug_crc
                                );
                        res.status(200).json(response);
                }),
                getDetailControllers: asyncHandler(async (req, res) => {
                        const response =
                                await articlesService.get.getDetailService(
                                        req.params.slug,
                                        req.params.slug_crc
                                );
                        res.status(200).json(response);
                }),
                getByViewsController: asyncHandler(async (req, res) => {
                        const views_news =
                                await articlesService.get.getByMostView(
                                        req.query.slug_crc
                                );
                        res.status(200).json(views_news);
                }),
                getByPublishAtController: asyncHandler(async (req, res) => {
                        const news = await articlesService.get.getByPublishAt(
                                req.query
                        );
                        res.status(200).json({ newArticleCate: news });
                }),
                getBoxCategoryControllers: asyncHandler(async (req, res) => {
                        const box =
                                await articlesService.get.getHotBoxSubCategoryService(
                                        req.query?.slug_crc
                                );
                        res.status(200).json({ box });
                }),
        },
};

module.exports = articlesController;
