const db = require("../../../config/userModels");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { internalServerError } = require("../../../helper/handle_error");
const authServices = {
      registerService: (data) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const res = await db.User.findOne({
                              where: [
                                    {
                                          email: data.email,
                                    },
                              ],
                        });

                        if (!res) {
                              bcrypt.hash(
                                    data.password,
                                    process.env.SALTROUNDS,
                                    function (err, hash) {
                                          console.log(hash);
                                    }
                              );
                              // const response = await db.User.create({
                              //       email: data.email,
                              //       password: data.password,
                              // });
                              if (1) {
                                    resolve({ message: "ok" });
                              }
                              resolve(res);
                        } else {
                              resolve({ message: "Da ton tai tai khoan!" });
                        }
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      loginService: (data) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const res = await db.User.findOne({
                              where: [
                                    {
                                          email: data.email,
                                    },
                              ],
                        });
                        if (res) {
                              resolve({ dataUser: res, status: 0 });
                        } else {
                              resolve({ message: "User not found", status: 0 });
                        }
                  } catch (error) {
                        reject(error);
                  }
            });
      },
};

module.exports = authServices;
