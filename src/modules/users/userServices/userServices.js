const db = require("../../../config/userModels");
const axios = require("axios");

const userServices = {
      getUserService: async (id) => {
            const user = await db.User.findOne({
                  where: {
                        id,
                  },
                  attributes: [
                        "name",
                        "email",
                        "avatar",
                        "tokenOAuth",
                        "role_id",
                  ],
            });
            if (user.tokenOAuth) {
                  try {
                        const response1 = await axios.get(
                              "https://www.googleapis.com/oauth2/v3/userinfo",
                              {
                                    headers: {
                                          Authorization: `Bearer ${user.tokenOAuth}`,
                                    },
                              }
                        );
                  } catch (error) {}

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
            }
            if (user) {
                  return { user };
            } else {
                  return { message: "Khong tim thay nguoi dung" };
            }
      },
};
module.exports = userServices;
