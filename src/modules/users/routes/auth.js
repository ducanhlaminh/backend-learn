require("../../../../passport");
const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const authController = require("../userControllers/authControllers");

authRoutes.post("/register", authController.registerController);
authRoutes.post("/login", authController.loginController);
authRoutes.get(
      "/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get(
      "/google/callback",
      (req, res, next) => {
            // passport.authenticate("google", (err, data) => {
            //       req.user = data.profile;
            //       next();
            // })(req, res, next);
            res.redirect(
                  process.env.CLIENT_URL +
                        "/login-success?code=" +
                        req.query.code
            );
      },
      (req, res) => {
            // Successful authentication, redirect home.
            res.redirect(
                  process.env.CLIENT_URL + "/login-success/" + req.user?.id
            );
      }
);
authRoutes.get(
      "/login-success",
      (req, res, next) => {
            passport.authenticate("google", (err, profile) => {
                  req.user = profile;
                  next();
            })(req, res, next);
      },
      authController.loginSuccessController
);
module.exports = authRoutes;
