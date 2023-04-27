const categoryService = require("../service/categoriy");

const categoryControllers = {
        createCategoryControllers: async (req, res) => {
                const response = await categoryService.createCategory(req.body);
                res.status(200).json(response);
        },
        getCateById: async (req, res) => {
                const response = await categoryService.getCategoryById(
                        req.params.id
                );
                res.status(200).json(response);
        },
};
module.exports = categoryControllers;
