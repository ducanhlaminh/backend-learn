const adminServices = require("../userServices/adminServices");
const { articels } = require("../../../untils/dataDemo");
const adminControllers = {
        get_articles: {
                getAllController: async (req, res) => {
                        const response = await adminServices.get.getAllService(
                                req.query
                        );
                        res.status(200).json(response);
                },
        },
        update_articles: {
                publishController: async (req, res) => {
                        const file = req.file;
                        const response =
                                await adminServices.update.updateArticleService(
                                        req.params.id,
                                        req.body,
                                        file
                                );
                        res.status(200).json(response);
                },
                updateHotMainController: async (req, res) => {
                        const response =
                                await adminServices.update.updateHotMain(
                                        req.body,
                                        req.params.id
                                );
                        res.status(200).json(response);
                },
                updateHotCateController: async (req, res) => {
                        const response =
                                await adminServices.update.updateHotCate(
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
                                await adminServices.create.createArticleService(
                                        file,
                                        req.body
                                );
                        res.status(200).json(response);
                },
                createHotMainController: async (req, res) => {
                        const response =
                                await adminServices.create.createHotMain(
                                        req.body.data
                                );
                        res.status(200).json(response);
                },
                createHotCateController: async (req, res) => {
                        const response =
                                await adminServices.create.createHotCate(
                                        req.body
                                );
                        res.status(200).json(response);
                },
        },
        delete: {
                deleteArticleController: async (req, res) => {
                        const response =
                                await adminServices.delete.deleteArticleService(
                                        req.query.id
                                );
                        return res.status(200).json(response);
                },
                deleteHotMain: async (req, res) => {
                        const response =
                                await adminServices.delete.deleteHotMainService(
                                        req.query
                                );
                        return res.status(200).json(response);
                },
                deleteHotCate: async (req, res) => {
                        const response =
                                await adminServices.delete.deleteHotCateService(
                                        req.query
                                );
                        return res.status(200).json(response);
                },
        },
        insert: {
                insertData: async (req, res) => {
                        const response =
                                await adminServices.insert.insertDataService(
                                        articels
                                );
                        res.status(200).json(response);
                },
                publishData: async (req, res) => {
                        const response =
                                await adminServices.insert.pushlishedAllService();
                        res.status(200).json(response);
                },
        },
};
module.exports = adminControllers;
