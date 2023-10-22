const db = require("../../../config/userModels");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const client = require("../../../untils/redis");
const userServices = {
        user: {
                getUserService: async (id) => {
                        console.log("123");
                        const user = await db.User.findOne({
                                where: {
                                        id,
                                },
                                attributes: [
                                        "name",
                                        "email",
                                        "avatar",
                                        "role_id",
                                        "id",
                                ],
                                include: {
                                        model: db.Role,
                                },
                        });
                        try {
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
                        } catch (error) {
                                console.log(error);
                        }

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
                },
                updateService: async (id, data, token) => {
                        await db.User.update(data, {
                                where: {
                                        id,
                                },
                        });
                        await client.set(token, "expired");
                        const res = await client.get(token);

                        return res;
                },
        },
        admin: {
                getAllService: async ({ page = 1, order, ...query }) => {
                        let queries = {};
                        if (query.name) {
                                query.name = { [Op.substring]: query.name };
                        }
                        (queries.limit = +process.env.LIMIT),
                                (queries.offset =
                                        (page - 1) * +process.env.LIMIT);
                        if (order) queries.order = JSON.parse(order);
                        try {
                                let user;
                                user = await dbUser.User.findAndCountAll({
                                        ...queries,
                                        where: {
                                                ...query,
                                        },
                                        include: {
                                                model: dbUser.Role,
                                        },
                                        distinct: true,
                                });

                                return user;
                        } catch (error) {
                                console.log(error);
                                return {
                                        message: "Failed to get user",
                                };
                        }
                },
                createUserService: async (data) => {
                        try {
                                data.role_id = parseInt(data.role_id, 10);
                                const [user, created] =
                                        await dbUser.User.findOrCreate({
                                                where: {
                                                        email: data?.email,
                                                },
                                                defaults: {
                                                        email: data?.emails,
                                                        typeLogin: 1,
                                                        name: data?.name,
                                                        role_id: data?.role_id,
                                                },
                                        });
                                if (!created) {
                                        return {
                                                message: "Email này đã được sử dụng",
                                                status: 0,
                                        };
                                }
                                return {
                                        message: "Người dùng đã được tạo thành công",
                                        status: 1,
                                };
                        } catch (error) {
                                console.log(error);
                        }
                },
        },
};
module.exports = userServices;
