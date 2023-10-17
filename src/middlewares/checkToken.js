const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
require("dotenv").config();
const db = require("../config/userModels");
const passport = require("passport");

const checkToken = (req, res, next) => {
    let accessToken = req?.headers?.authorization;
    if (!accessToken) {
        return res.status(400).json({
            message: "Missing token from request",
            status: 1,
        });
    }
    let tokenRegex =
        /^(Bearer)\s[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    if (!tokenRegex.test(accessToken))
        return res.status(401).json({
            stauts: 1,
            message: "Token không hợp lệ",
        });
    let token = accessToken.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(401).json({
                status: -1,
                message: "Verify Failed !!!",
            });
        }

        req.user = user;
        next();
    });
};
const checkEditor = (req, res, next) => {
    if (req.user?.role !== "0") {
        return res.status(404).json({
            status: 3,
            message: "Require Editor Role !",
        });
    }
    next();
};
const checkUserManager = (req, res, next) => {
    if (req.user?.role !== 1) {
        return res.status(404).json({
            status: 3,
            message: "Require Manager Role !",
        });
    }
    next();
};
const checkNewManager = (req, res, next) => {
    if (req.user?.role !== 1) {
        return res.status(404).json({
            status: 3,
            message: "Require Manager Role !",
        });
    }
    next();
};
const checkSuperManager = (req, res, next) => {
    if (req.user?.role !== 1) {
        return res.status(404).json({
            status: 3,
            message: "Require Manager Role !",
        });
    }
    next();
};

module.exports = {
    checkToken,
    checkUserManager,
    checkEditor,
    checkSuperManager,
    checkNewManager,
};
