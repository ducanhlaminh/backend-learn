const db = require("../../../config/userModels");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");
const options = { expiresIn: "10s" };
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const authServices = {
        registerService: asyncHandler(async (data) => {
                try {
                        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
                        if (regex.test(data.password)) {
                                const hash = await new Promise(
                                        (resolve, reject) => {
                                                bcrypt.genSalt(
                                                        10,
                                                        (err, salt) => {
                                                                bcrypt.hash(
                                                                        data.password,
                                                                        salt,
                                                                        async (
                                                                                err,
                                                                                hashedPassword
                                                                        ) => {
                                                                                resolve(
                                                                                        hashedPassword
                                                                                );
                                                                        }
                                                                );
                                                        }
                                                );
                                        }
                                );
                                const [user, created] =
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
                                if (created) {
                                        let testAccount =
                                                await nodemailer.createTestAccount();
                                        let transporter =
                                                nodemailer.createTransport({
                                                        service: "Gmail",
                                                        auth: {
                                                                user: "ducanhlaminh@gmail.com",
                                                                pass: "isqy fnls wqfw qlmu",
                                                        },
                                                });
                                        2;
                                        let info = await transporter.sendMail({
                                                from: '"test" <ducanhlaminh@gmail.com>', // sender address
                                                to: "ducanh6xxx@gmail.com", // list of receivers
                                                subject: "Test send email ✔", // Subject line
                                                text: "Hello world?", // plain text body
                                                html: "<div><b>Tài khoản này đã được đăng ký thành công</b></div><span>Vui lòng truy cập vào link sau đây để đăng nhập vào hệ thống </span>", // html body
                                        });

                                        return {
                                                message: " Đăng ký thành công",
                                                status: 1,
                                        };
                                } else {
                                        return {
                                                message: "Email này đã được tồn tại",
                                                status: 0,
                                        };
                                }
                        }
                } catch (error) {
                        return { status: -1, error: error.message };
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
                                const passwordMatch = await new Promise(
                                        (resolve, reject) => {
                                                bcrypt.compare(
                                                        data.password,
                                                        user.password,
                                                        function (err, result) {
                                                                if (err) {
                                                                        reject(
                                                                                err
                                                                        );
                                                                } else {
                                                                        resolve(
                                                                                result
                                                                        );
                                                                }
                                                        }
                                                );
                                        }
                                );

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
                console.log(user);
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
