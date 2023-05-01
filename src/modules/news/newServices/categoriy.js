const db = require("../../../config/newModels");

const categoryService = {
      createCategory: (data) => {
            return new Promise((resolve, reject) => {
                  try {
                        const response = db.new_category.create({
                              ...data,
                        });
                        resolve(response);
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      getCategoryById: (id) => {
            return new Promise((resolve, reject) => {
                  try {
                        const response = db.new_category.findOne({
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
};

module.exports = categoryService;
