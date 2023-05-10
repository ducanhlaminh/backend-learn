const articlesService = require("../newServices/articlesService");
const articlesController = {
      getAllControllers: async (req, res) => {
            const response = await articlesService.getAllService();
            res.status(200).json(response);
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
      setHotNewsMainController: async (req, res) => {
            const response = await articlesService.setHotNewsMain(req.body);
            res.status(200).json(response);
      },
      setHotNewsCateController: async (req, res) => {
            const response = await articlesService.setHotNewsCate(req.body);
            res.status(200).json(response);
      },
};
module.exports = articlesController;
