const db = require("../../../config/userModels");

const userServices = {
    getUserService: async (id) => {
        const user = await db.User.findOne({
            where: {
                id,
            },
            attributes: ["name", "email", "avatar"],
        });
        if (user) {
            return { user };
        } else {
            return { message: "Khong tim thay nguoi dung" };
        }
    },
};
module.exports = userServices;
