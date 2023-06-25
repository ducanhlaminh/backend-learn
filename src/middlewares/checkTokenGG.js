const passport = require("passport");
const {
    OAuth2Strategy: GoogleOAuth2Strategy,
} = require("passport-google-oauth20");

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
module.exports = checkTokenGG;
