const categoryService = require("../newServices/categoriy");

const categoryControllers = {
      createCategoryControllers: async (req, res) => {
            const response = await categoryService.create(req.body);
            res.status(200).json(response);
      },

      getAll: async (req, res) => {
            const response = await categoryService.getAll();
            res.status(200).json(response);
      },
};
module.exports = categoryControllers;
