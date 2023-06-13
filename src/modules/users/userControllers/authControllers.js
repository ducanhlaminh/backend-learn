const { response } = require("express");
const userServices = require("../userServices/authServices");
const { Model } = require("sequelize");
const authControllers = {
    registerController: async (req, res) => {
        const response = await userServices.registerService(req.body);
        res.status(200).json(response);
    },
    loginController: async (req, res) => {
        const response = await userServices.loginService(req.body);
        res.status(200).json(response);
    },
};
module.exports = authControllers;
