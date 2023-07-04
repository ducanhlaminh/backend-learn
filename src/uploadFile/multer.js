var multer = require("multer");
const crc32 = require("crc/crc32");
var storage = multer.diskStorage({
        destination: function (req, file, cb) {
                cb(null, "src/uploadFile/avatarArticles");
        },
        filename: function (req, file, cb) {
                cb(null, file.originalname);
        },
});

const uploadFileServer = multer({ storage: storage }); //save trên local của server khi dùng multer
module.exports = uploadFileServer;
