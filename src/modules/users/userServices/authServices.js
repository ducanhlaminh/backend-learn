const db = require("../../../config/userModels");
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
                              const response = await db.User.create({
                                    email: data.email,
                                    password: data.password,
                              });
                              if (response) {
                                    resolve(response);
                              }
                        }
                        resolve(res);
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
