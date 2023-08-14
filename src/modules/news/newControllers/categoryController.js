const categoryService = require("../newServices/categoryService");
const { cates } = require("../../../untils/dataDemo");
const asyncHandler = require("express-async-handler");

const categoryControllers = {
        createCategoryControllers: asyncHandler(async (req, res) => {
                const response = await categoryService.create(req.body);
                res.status(200).json(response);
        }),

        getAll: async (req, res) => {
                const response = await categoryService.getAll();
                res.status(200).json(response);
        },
        getByName: async (req, res) => {
                const response = await categoryService.getByNameService(
                        req.query.name
                );
                res.status(200).json(response);
        },
        getSubCate: async (req, res) => {
                const response = await categoryService.getSubCateService(
                        req.params.slug_crc
                );
                res.status(200).json(response);
        },
        insertData: async (req, res) => {
                const response = await categoryService.insertDataService(cates);
                res.status(200).json(response);
        },
        // admin
        getAllByAdminControl: async (req, res) => {
                const response = await categoryService.getAllByAdmin();
                res.status(200).json(response);
        },
        deleteCategory: async (req, res) => {
                const response = await categoryService.deleteService(
                        req.query.id
                );
                res.status(200).json(response);
        },
        updateCategory: async (req, res) => {
                const response = await categoryService.updateService(
                        req.body,
                        req.query.id
                );
                res.status(200).json(response);
        },
};
module.exports = categoryControllers;
