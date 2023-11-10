const authServices = require("../authService/authServices");
const authControllers = {
    registerController: async (req, res) => {
        const response = await authServices.registerService(req.body);
        res.status(200).json(response);
    },
    loginController: async (req, res) => {
        const response = await authServices.loginService(req.body);
        res.status(200).json(response);
    },
    loginSuccessController: async (req, res) => {
        const response = await authServices.loginGoogleService(
            req.user,
            req.profile
        );
        res.status(200).json(response);
    },
};
module.exports = authControllers;
