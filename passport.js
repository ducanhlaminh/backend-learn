require("dotenv").config();
const db = require("./src/config/userModels");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile, cb) {
            await db.User.findOrCreate({
                where: {
                    id: profile?.id,
                },
                defaults: {
                    id: profile?.id,
                    email: profile?.emails[0]?.value,
                    typeLogin: 1,
                    name: profile?.displayName,
                    avatar: profile?.photos[0]?.value,
                },
            });
            return cb(null, profile);
        }
    )
);
