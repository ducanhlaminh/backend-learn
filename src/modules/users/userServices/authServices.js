const db = require("../../../config/userModels");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");
const options = { expiresIn: "1h" };

const authServices = {
    registerService: async (data) => {
        try {
            const hash = await new Promise((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                    }

                    bcrypt.hash(
                        data.password,
                        salt,
                        async (err, hashedPassword) => {
                            resolve(hashedPassword);
                            // Lưu trữ hashedPassword trong cơ sở dữ liệu hoặc thực hiện các thao tác khác
                        }
                    );
                });
            });
            const res = await db.User.findOrCreate({
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
    },
    loginService: async (data) => {
        try {
            const user = await db.User.findOne({
                where: {
                    email: data.email,
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
                        { userId: user.id, role: user.role_id },
                        process.env.SECRET_KEY,
                        options
                    );
                    return {
                        token: `Bearer ${token}`,
                        message: "Đăng nhập thành công",
                        status: 0,
                    };
                } else {
                    return { message: "Đăng nhập không thành công", status: 0 };
                }
            } else {
                return { message: "Không tồn tại người dùng", status: 0 };
            }
        } catch (error) {
            return error;
        }
    },
    loginGoogleService: async (id) => {
        const user = await db.User.findOne({
            where: {
                id,
            },
        });
        if (user) {
            const token = jwt.sign(
                { userId: user.id, role: user.role_id },
                process.env.SECRET_KEY
            );
            return {
                token: `Bearer ${token}`,
                message: "Đăng nhập google thành công",
            };
        } else {
            return { message: "Đăng nhập google không thành công" };
        }
    },
};

module.exports = authServices;
