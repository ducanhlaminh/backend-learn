const articlesService = require("../newServices/articlesService");
const articlesController = {
      getHotControllers: async (req, res) => {
            const hot_news = await articlesService.getHotService();
            res.status(200).json({ hot_news });
      },
      getByViewsController: async (req, res) => {
            const views_news = await articlesService.getByMostView();
            res.status(200).json(views_news);
      },
      getByPublishAtController: async (req, res) => {
            const news = await articlesService.getByPublishAt(req.query.slug);
            res.status(200).json(news);
      },
      createArticleControllers: async (req, res) => {
            const response = await articlesService.createArticleService(
                  req.body
            );
            res.status(200).json(response);
      },
      getByTitleControllers: async (req, res) => {
            const response = await articlesService.getByTitleService(
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
      publishController: async (req, res) => {
            const response = await articlesService.publishService(
                  req.params.id
            );
            res.status(200).json(response);
      },
      publishBookController: async (req, res) => {
            const response = await articlesService.publishBookService(
                  req.params.id
            );
            res.status(200).json(response);
      },
      createHotMainController: async (req, res) => {
            const response = await articlesService.createHotMain(req.body);
            res.status(200).json(response);
      },
      createHotCateController: async (req, res) => {
            const response = await articlesService.createHotCate(req.body);
            res.status(200).json(response);
      },
      updateHotMainController: async (req, res) => {
            const response = await articlesService.updateHotMain(
                  req.body,
                  req.params.id
            );
            res.status(200).json(response);
      },
      getHotCategoryController: async (req, res) => {
            const response = await articlesService.getHotCategoryService(
                  req.params.slug
            );
            res.status(200).json(response);
      },
};

module.exports = articlesController;
