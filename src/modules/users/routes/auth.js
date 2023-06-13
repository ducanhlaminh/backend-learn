require("../../../../passport");
const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const authController = require("../userControllers/authControllers");

authRoutes.post("/register", authController.registerController);
authRoutes.post("/login", authController.loginController);
authRoutes.get(
    "/google",
    passport.authenticate("google", { scope: ["profile"], session: false })
);

authRoutes.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", (err, res, next) => {
            if (err) {
                console.log(err);
            }

            req.user = res;
            next();
        });
    },
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect(process.env.CLIENT_URL + "/login-success/" + req.user?.id);
    }
);
module.exports = authRoutes;
