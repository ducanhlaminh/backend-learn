const adminServices = require("../userServices/adminServices");
const { articels } = require("../../../untils/dataDemo");
const asyncHandler = require("express-async-handler");
const adminControllers = {
    insert: {
        insertData: async (req, res) => {
            const response = await adminServices.insert.insertDataService(
                articels
            );
            res.status(200).json(response);
        },
        publishData: async (req, res) => {
            const response = await adminServices.insert.pushlishedAllService();
            res.status(200).json(response);
        },
    },
    user: {
        getAllController: asyncHandler(async (req, res) => {
            const response = await adminServices.user.getAllService(req.query);
            res.status(200).json(response);
        }),
        createdController: asyncHandler(async (req, res) => {
            const response = await adminServices.user.createUserService(
                req.body
            );
            res.status(200).json(response);
        }),
    },
};
module.exports = adminControllers;
