const db = require("../../../config/userModels");
const jwt = require("jsonwebtoken");
const redis = require("../../../untils/redis");
const dbUser = require("../../../config/userModels");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
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
                  const respon = await db.User.update(
                        data,
                        {
                              where: {
                                    id,
                              },
                        },
                        t
                  );
                  jwt.verify(
                        token,
                        process.env.SECRET_KEY,
                        async (err, user) => {
                              if (user?.userId === id) {
                                    await redis.set(
                                          `blacklist_token_${token}`,
                                          "1"
                                    );
                              } else {
                                    await redis.set(`blacklist_id_${id}`, "1");
                              }
                        }
                  );

                  return respon;
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
                        const hash = await new Promise((resolve, reject) => {
                              bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(
                                          "Admin123",
                                          salt,
                                          async (err, hashedPassword) => {
                                                resolve(hashedPassword);
                                          }
                                    );
                              });
                        });
                        const [user, created] = await dbUser.User.findOrCreate({
                              where: {
                                    email: data?.email,
                              },
                              defaults: {
                                    email: data?.emails,
                                    role_id: data?.role_id,
                                    password: hash,
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
                        // await db.new_article.update(
                        //     { status: 0, created_user_id: null },
                        //     {
                        //         where: {
                        //             created_user_id: id,
                        //         },
                        //     }
                        // );
                        await db.User.destroy({
                              where: {
                                    id,
                              },
                        });
                        return {
                              message: "Xóa người dùng thành công",
                              status: 1,
                        };
                  } catch (error) {
                        console.log(error);
                  }
            },
            updateService: async (id, data) => {
                  const respon = await db.User.update(
                        data,
                        {
                              where: {
                                    id,
                              },
                        },
                        t
                  );
                  await redis.set(`blacklist_id_${id}`, "1");
                  return respon;
            },
      },
};
module.exports = userServices;
