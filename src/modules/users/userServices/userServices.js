const db = require("../../../config/userModels");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const client = require("../../../untils/redis");
const dbUser = require("../../../config/userModels");
const { Op } = require("sequelize");
const userServices = {
    user: {
        getUserService: async (id) => {
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
                    "userName",
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
                (queries.offset = (page - 1) * +process.env.LIMIT);
            if (order) queries.order = JSON.parse(order);
            try {
                let user;
                user = await dbUser.User.findAndCountAll({
                    ...queries,
                    where: {
                        ...query,
                        [Op.not]: {
                            name: null,
                        },
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
        getDetailSerive: async (id) => {
            try {
                const user = await dbUser.User.findOne({
                    where: {
                        id,
                    },
                });
                if (user) {
                    return { user, status: 1 };
                } else {
                }
                return {
                    message: "Not found user",
                    status: 0,
                };
            } catch (error) {
                console.log(error);
            }
        },
        createUserService: async (data) => {
            try {
                data.role_id = parseInt(data.role_id, 10);
                const [user, created] = await dbUser.User.findOrCreate({
                    where: {
                        email: data?.email,
                    },
                    defaults: {
                        email: data?.emails,
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
        getDeleteSerive: async (id) => {
            try {
                await dbUser.User.destroy({
                    where: {
                        id,
                    },
                });
                return { message: "Xóa người dùng thành công", status: 1 };
            } catch (error) {
                console.log(error);
            }
        },
    },
};
module.exports = userServices;
