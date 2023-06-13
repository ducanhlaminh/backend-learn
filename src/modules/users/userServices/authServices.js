const db = require("../../../config/userModels");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { internalServerError } = require("../../../helper/handle_error");
const options = { expiresIn: "1h" };

const authServices = {
    registerService: async (data) => {
        try {
            const res = await db.User.findOne({
                where: [
                    {
                        email: data.email,
                    },
                ],
            });
            if (!res) {
                const hash = await new Promise((resolve, reject) => {
                    bcrypt.genSalt(process.env.saltRounds, (err, salt) => {
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
                const response = await db.User.create({
                    email: data.email,
                    password: hash,
                });
                return response;
            } else {
                return { message: "Email da duoc dang ky!" };
            }
        } catch (error) {
            return error;
        }
    },
    loginService: async (data) => {
        try {
            const res = await db.User.findOne({
                where: {
                    email: data.email,
                },
            });
            if (res) {
                const passwordMatch = await new Promise((resolve, reject) => {
                    bcrypt.compare(
                        data.password,
                        res.password,
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
                        { userId: res.id, role: res.role_id },
                        process.env.SECRET_KEY,
                        options
                    );
                    return {
                        token,
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
};

module.exports = authServices;
