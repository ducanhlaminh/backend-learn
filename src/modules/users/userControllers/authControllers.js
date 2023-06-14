const userServices = require("../userServices/authServices");
const authControllers = {
    registerController: async (req, res) => {
        const response = await userServices.registerService(req.body);
        res.status(200).json(response);
    },
    loginController: async (req, res) => {
        const response = await userServices.loginService(req.body);
        res.status(200).json(response);
    },
    loginSuccessController: async (req, res) => {
        const response = await userServices.loginGoogleService(req.params.id);
        res.status(200).json(response);
    },
};
module.exports = authControllers;
