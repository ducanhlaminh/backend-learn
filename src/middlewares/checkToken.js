const jwt = require("jsonwebtoken");
require("dotenv").config();
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
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        if (err) {
            return res.status(401).json({
                status: -1,
                message: "Verify Failed !!!",
            });
        }
        req.user = decode;
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
const checkManager = (req, res, next) => {
    if (req.user?.role !== "1") {
        return res.status(404).json({
            status: 3,
            message: "Require Manager Role !",
        });
    }
    next();
};
module.exports = { checkToken, checkManager, checkEditor };
