const passport = require("passport");
const {
    OAuth2Strategy: GoogleOAuth2Strategy,
} = require("passport-google-oauth20");

passport.use(
    new GoogleOAuth2Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // Thay YOUR_CLIENT_ID bằng Client ID của ứng dụng Google
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Thay YOUR_CLIENT_SECRET bằng Client Secret của ứng dụng Google
        },
        (accessToken, refreshToken, profile, done) => {
            // Kiểm tra tính hợp lệ của accessToken
            if (accessTokenIsValid(accessToken)) {
                // Access token hợp lệ
                return done(null, profile);
            } else {
                // Access token không hợp lệ
                return done(null, false);
            }
        }
    )
);

function accessTokenIsValid(accessToken) {
    try {
        const decodedToken = jwt.verify(accessToken, secretKey);
        // Nếu không xảy ra lỗi khi xác minh chữ ký, access token được coi là hợp lệ
        return true;
    } catch (error) {
        // Xử lý lỗi xác minh chữ ký
        return false;
    }
}
