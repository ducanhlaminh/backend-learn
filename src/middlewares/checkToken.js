const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../config/userModels");

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
    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
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
const checkTokenGG = (req, res, next) => {
    passport.use(
        new GoogleOAuth2Strategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID, // Thay YOUR_CLIENT_ID bằng Client ID của ứng dụng Google
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Thay YOUR_CLIENT_SECRET bằng Client Secret của ứng dụng Google
            },
            (accessToken, refreshToken, profile, done) => {
                // Kiểm tra tính hợp lệ của accessToken
                if (accessToken === localStorage.getItem("token")) {
                    // Access token hợp lệ
                    console.log(profile);
                    next();
                } else {
                    // Access token không hợp lệ
                    return res.status(401).json({
                        status: -1,
                        message: "Verify Failed GG!!!",
                    });
                }
            }
        )
    );
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
