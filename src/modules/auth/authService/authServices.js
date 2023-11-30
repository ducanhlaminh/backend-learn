const db = require("../../../config/userModels");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");
const options = { expiresIn: "10s" };
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const generatePassword = require("../../../untils/func");

const authServices = {
    registerService: asyncHandler(async (data) => {
        try {
            const [user, created] = await db.User.findOrCreate({
                where: [
                    {
                        email: data.email,
                    },
                ],
                defaults: {
                    id: uuid(),
                    email: data.email,
                    role_id: data.role_id,
                },
            });
            if (created) {
                let testAccount = await nodemailer.createTestAccount();
                let transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "ducanhlaminh@gmail.com",
                        pass: "isqy fnls wqfw qlmu",
                    },
                });
                2;
                let info = await transporter.sendMail({
                    from: '"test" <ducanhlaminh@gmail.com>', // sender address
                    to: data.email, // list of receivers
                    subject: "Test send email ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: ` <div><b>Tài khoản này đã được đăng ký thành công</b></div>
                    <span
                        >Vui lòng truy cập vào link sau đây để đăng nhập vào hệ thống
                        :</span
                    >
                    <div>
                        <a href="http://localhost:4000/api/v1/auth/google"
                            >http://localhost:4200/auth/login</a
                        >
                    </div>
                    <div class="email">
                        <label for="">Email : </label>
                        <span>${data.email}</span>
                    </div>
                    `, // html body
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
        } catch (error) {
            return { status: -1, error: error.message };
        }
    }),
    loginService: asyncHandler(async (data) => {
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
                                console.log(result);
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
                        status: true,
                    };
                } else {
                    return {
                        message:
                            "Email hoặc mật khẩu tài khoản không chính xác",
                        status: false,
                        token: null,
                    };
                }
            }
            return {
                message: "Email hoặc mật khẩu tài khoản không chính xác",
                status: false,
                token: null,
            };
        } catch (error) {
            console.log(error);
            return error;
        }
    }),
    loginGoogleService: asyncHandler(async (user, profile) => {
        if (user) {
            const password = generatePassword();
            const hash = await new Promise((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, async (err, hashedPassword) => {
                        resolve(hashedPassword);
                    });
                });
            });
            const checkUser = await db.User.findOne({
                where: {
                    id: user.id,
                },
            });
            if (!checkUser.password) {
                await db.User.update(
                    {
                        password: hash,
                    },
                    {
                        where: {
                            id: user.id,
                        },
                    }
                );
            }
            await db.User.update(
                {
                    avatar: profile?.photos[0]?.value,
                    name: profile?.displayName,
                    password: hash,
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
