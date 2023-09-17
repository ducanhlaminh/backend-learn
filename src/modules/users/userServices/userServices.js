const db = require("../../../config/userModels");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const userServices = {
        getUserService: async (id) => {
                const user = await db.User.findOne({
                        where: {
                                id,
                        },
                        attributes: [
                                "name",
                                "email",
                                "avatar",
                                "tokenOAuth",
                                "role_id",
                        ],
                        include: {
                                model: db.Role,
                        },
                });
                if (user?.tokenOAuth) {
                        try {
                                // const response1 = await axios.get(
                                //         "https://www.googleapis.com/oauth2/v3/userinfo",
                                //         {
                                //                 headers: {
                                //                         Authorization: `Bearer ${user.tokenOAuth}`,
                                //                 },
                                //         }
                                // );
                                const token = jwt.sign(
                                        { userId: user.id, role: user.role_id },
                                        process.env.SECRET_KEY,
                                        { expiresIn: "10s" }
                                );
                                if (user) {
                                        return {
                                                user,
                                                token: `Bearer ${token}`,
                                        };
                                } else {
                                        return {
                                                message: "Khong tim thay nguoi dung",
                                        };
                                }
                        } catch (error) {}

                        // if (response1.data.name) {
                        //     // await db.User.update(
                        //     //     {
                        //     //         name: response1.data.name,
                        //     //         avatar: response1.data.avatar,
                        //     //     },
                        //     //     {
                        //     //         where: {
                        //     //             id,
                        //     //         },
                        //     //     }
                        //     // );
                        // } else {
                        //     localStorage.clear("token");
                        // }
                }
        },
};
module.exports = userServices;
