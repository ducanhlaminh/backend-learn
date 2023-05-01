const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const articlesService = {
      getAllService: (req, res) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const articles = await db.new_article.findAll({
                              include: [
                                    {
                                          model: db.new_articles_category,
                                          as: "article_category",
                                          attributes: [
                                                "category_id",
                                                "article_id",
                                          ],

                                          include: [
                                                {
                                                      model: db.new_category,
                                                      as: "dataCategory",
                                                },
                                          ],
                                    },
                              ],
                        });
                        resolve({
                              articles,
                              status: 0,
                        });
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      getByTitleService: (title) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const articles = await db.new_article.findAll({
                              attributes: ["title", "slug", "avatar", "sapo"],
                              where: { title: { [Op.like]: `%${title}%` } },
                        });
                        resolve({
                              data: articles,
                              status: 0,
                        });
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      getByCateService: (id) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        let Cates = await db.new_category.findOne({
                              where: [
                                    {
                                          id,
                                    },
                              ],
                              include: [
                                    {
                                          model: db.new_category,
                                          as: "childCategories",
                                    },
                              ],
                        });
                        let listCates = Cates.childCategories.map(
                              (item) => item.id
                        );
                        const articles = await db.new_article.findAll({
                              attributes: ["title", "slug", "avatar", "sapo"],
                              include: [
                                    {
                                          model: db.new_articles_category,
                                          as: "article_category",
                                          attributes: [
                                                "category_id",
                                                "article_id",
                                          ],
                                          where: [
                                                {
                                                      category_id: [
                                                            parseInt(id),
                                                            ...listCates,
                                                      ],
                                                },
                                          ],
                                          include: [
                                                {
                                                      model: db.new_category,
                                                      as: "dataCategory",
                                                },
                                          ],
                                    },
                              ],
                        });
                        resolve({
                              articles,
                              status: 0,
                        });
                  } catch (error) {
                        reject(error);
                  }
            });
      },

      createArticleService: (data) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const check = await db.new_article.findOne({
                              where: { title: data.title },
                        });
                        if (check) {
                              resolve({
                                    status: 0,
                                    message: "Đã tồn tại bài viết với title này ",
                              });
                        } else {
                              const response = await db.new_article.create({
                                    ...data,
                              });
                              const res = await db.new_articles_category.create(
                                    {
                                          article_id: response.id,
                                          category_id: data.category_id,
                                    }
                              );
                              console.log(res);
                              resolve({
                                    status: 0,
                                    message: "Đã thêm bài viết thành công",
                              });
                        }
                  } catch (error) {
                        reject(error);
                  }
            });
      },
};

module.exports = articlesService;
