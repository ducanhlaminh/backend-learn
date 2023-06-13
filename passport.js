require("dotenv").config();
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
            return cb(err, profile);
        }
    )
);
