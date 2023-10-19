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
        getAllController: async (req, res) => {
            const response = await adminServices.user.getAllService(req.query);
            res.status(200).json(response);
        },
        createdController: async (req, res) => {
            const response = await adminServices.user.createUserService(
                req.body
            );
            res.status(200).json(response);
        },
    },
};
module.exports = userControllers;
