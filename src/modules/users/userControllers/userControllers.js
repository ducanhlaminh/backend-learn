const userServices = require("../userServices/userServices");
const userControllers = {
    user: {
        getUser: async (req, res) => {
            console.log(req.user);
            const response = await userServices.user.getUserService(
                req.user?.userId
            );
            return res.status(200).json(response);
        },
    },
    admin: {
        updateService: async (req, res) => {
            const response = await userServices.user.updateService(
                req.params.id,
                req.body,
                req.headers.authorization
            );
            res.status(200).json(response);
        },
        getAllController: async (req, res) => {
            const response = await userServices.admin.getAllService(req.query);
            res.status(200).json(response);
        },
        getDetailController: async (req, res) => {
            const response = await userServices.admin.getDetailSerive(
                req.params?.id
            );
            res.status(200).json(response);
        },
        createdController: async (req, res) => {
            const response = await userServices.admin.createUserService(
                req.body
            );
            res.status(200).json(response);
        },
        getDeleteController: async (req, res) => {
            const response = await userServices.admin.getDeleteSerive(
                req.query.id
            );
            res.status(200).json(response);
        },
    },
};
module.exports = userControllers;
