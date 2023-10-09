const db = require("../../../config/userModels");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");
const options = { expiresIn: "10s" };
const asyncHandler = require("express-async-handler");

const authServices = {
    registerService: asyncHandler(async (data) => {
        try {
            const hash = await new Promise((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(
                        data.password,
                        salt,
                        async (err, hashedPassword) => {
                            resolve(hashedPassword);
                        }
                    );
                });
            });
            await db.User.findOrCreate({
                where: [
                    {
                        email: data.email,
                    },
                ],
                defaults: {
                    password: hash,
                    id: uuid(),
                    email: data.email,
                },
            });

            return {
                message: " Đăng ký thành công , Vui lòng đăng nhập tài khoản",
            };
        } catch (error) {
            return error;
        }
    }),
    loginService: asyncHandler(async (email) => {
        try {
            const user = await db.User.findOne({
                where: {
                    email: email,
                },
            });
            if (user) {
                const passwordMatch = await new Promise((resolve, reject) => {
                    bcrypt.compare(
                        data.password,
                        user.password,
                        function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                });

                if (passwordMatch) {
                    const token = jwt.sign(
                        {
                            userId: user.id,
                            role: user.role_id,
                        },
                        process.env.SECRET_KEY,
                        { expiresIn: "10d" }
                    );
                    return {
                        token: `Bearer ${token}`,
                        message: "Đăng nhập thành công",
                        status: 0,
                    };
                } else {
                    return {
                        message: "Đăng nhập không thành công",
                        status: 0,
                    };
                }
            } else {
                return {
                    message: "Không tồn tại người dùng",
                    status: 0,
                };
            }
        } catch (error) {
            return error;
        }
    }),
    loginGoogleService: asyncHandler(async (user, profile) => {
        if (user) {
            await db.User.update(
                {
                    avatar: profile?.photos[0]?.value,
                },
                {
                    where: {
                        id: user.id,
                    },
                }
            );
        }
        if (user) {
            const token = jwt.sign(
                { userId: user.id, role: user.role_id },
                process.env.SECRET_KEY,
                { expiresIn: "1y" }
            );
            return {
                token: `Bearer ${token}`,
                role_id: user.role_id,
                message: "Đăng nhập google thành công",
            };
        } else {
            return { message: "Đăng nhập google không thành công" };
        }
    }),
};

module.exports = authServices;
