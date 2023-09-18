require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const db = require("./src/config/userModels");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
passport.use(
        new GoogleStrategy(
                {
                        clientID: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        callbackURL:
                                "http://localhost:4000/api/v1/auth/google/callback",
                },
                async function (accessToken, refreshToken, profile, cb) {
                        try {
                                const user = await db.User.findOne({
                                        where: {
                                                email: profile?.emails[0]
                                                        ?.value,
                                                typeLogin: 1,
                                        },
                                });
                                return cb(null, { user, profile });
                        } catch (error) {
                                console.log(error);
                        }
                }
        )
);
