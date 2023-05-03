const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const articlesService = {
      getAllService: (req, res) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const articlesCate = await db.new_category.findAll({
                              attributes: ["name", "id", "slug"],
                              include: [
                                    {
                                          model: db.new_articles_category,
                                          include: [
                                                {
                                                      model: db.new_article,
                                                      attributes: [
                                                            "id",
                                                            "title",
                                                            "slug",
                                                            "sapo",
                                                      ],
                                                },
                                          ],
                                    },
                              ],
                        });
                        const categories = await db.new_category.findAll({
                              where: [
                                    {
                                          parent_id: null,
                                    },
                              ],
                              attributes: ["name", "id", "slug"],
                        });
                        const articles = await db.new_article.findAll({
                              attributes: ["id", "title", "slug", "sapo"],
                        });
                        resolve({
                              articlesCate,
                              categories,
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
                        const articlesCate = await db.new_category.findOne({
                              attributes: ["name", "id", "slug"],
                              include: [
                                    {
                                          model: db.new_articles_category,
                                          include: [
                                                {
                                                      model: db.new_article,
                                                      attributes: [
                                                            "id",
                                                            "title",
                                                            "slug",
                                                            "sapo",
                                                      ],
                                                },
                                          ],
                                    },
                                    {
                                          model: db.new_category,
                                          as: "childCategories",
                                          include: [
                                                {
                                                      model: db.new_articles_category,
                                                      include: [
                                                            {
                                                                  model: db.new_article,
                                                                  attributes: [
                                                                        "id",
                                                                        "title",
                                                                        "slug",
                                                                        "sapo",
                                                                  ],
                                                            },
                                                      ],
                                                },
                                          ],
                                    },
                              ],
                        });

                        resolve({
                              articlesCate,
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
