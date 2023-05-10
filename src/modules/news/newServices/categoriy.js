const db = require("../../../config/newModels");
const crc32 = require("crc/crc32");
const categoryService = {
      create: (data) => {
            return new Promise((resolve, reject) => {
                  const slug_src = crc32(data.slug);
                  try {
                        const response = db.new_category.create({
                              ...data,
                              slug_src,
                        });
                        resolve(response);
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      getById: (id) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const response = await db.new_category.findOne({
                              where: {
                                    id,
                              },
                              include: {
                                    model: db.new_category,
                                    as: "childCategories",
                              },
                        });
                        resolve({ data: response });
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      getAll: () => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const response = await db.new_category.findAll({
                              attributes: ["name", "id", "slug"],
                              where: [
                                    {
                                          parent_id: null,
                                    },
                              ],
                              include: {
                                    model: db.new_category,
                                    as: "childCategories",
                                    attributes: ["name", "id", "slug"],
                              },
                        });
                        resolve({ categories: response });
                  } catch (error) {
                        reject(error);
                  }
            });
      },
};

module.exports = categoryService;
