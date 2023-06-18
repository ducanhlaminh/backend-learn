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
            callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile, cb) {
            if (refreshToken !== profile.refreshToken) {
                return cb(null, false);
            }
            const [user, created] = await db.User.findOrCreate({
                where: {
                    email: profile?.emails[0]?.value,
                    typeLogin: 1,
                },
                defaults: {
                    id: profile.id,
                    email: profile?.emails[0]?.value,
                    typeLogin: 1,
                    name: profile?.displayName,
                    avatar: profile?.photos[0]?.value,
                    tokenOAuth: accessToken,
                },
            });
            if (!created) {
                await db.User.update(
                    {
                        name: profile?.displayName,
                        avatar: profile?.photos[0]?.value,
                        tokenOAuth: accessToken,
                    },
                    {
                        where: {
                            email: profile?.emails[0]?.value,
                            typeLogin: 1,
                        },
                    }
                );
            }
            console.log(123);
            return cb(null, profile);
        }
    )
);
