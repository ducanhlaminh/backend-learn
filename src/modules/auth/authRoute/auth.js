const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const authController = require("../authController/authControllers");
require("../../../../passport");

authRoutes.post("/register", authController.registerController);
authRoutes.post("/login", authController.loginController);
authRoutes.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get("/google/callback", (req, res) => {
    // passport.authenticate("google", (err, data) => {
    //       req.user = data.profile;
    //       next();
    // })(req, res, next);
    res.redirect(
        process.env.CLIENT_URL + "/login-success?code=" + req.query.code
    );
});
authRoutes.get(
    "/login-success",
    (req, res, next) => {
        passport.authenticate("google", (err, data) => {
            req.user = data?.user;
            req.profile = data?.profile;
            next();
        })(req, res, next);
    },
    authController.loginSuccessController
);
module.exports = authRoutes;
