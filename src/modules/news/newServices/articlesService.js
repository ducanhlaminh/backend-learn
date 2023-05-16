const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const articlesService = {
      getHotService: (req, res) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const hot_main = await db.new_articles_hot_main.findAll(
                              {
                                    order: [["position", "ASC"]],
                                    attributes: ["article_id", "position"],
                                    include: [
                                          {
                                                model: db.new_article,
                                                attributes: [
                                                      "avatar",
                                                      "title",
                                                      "sapo",
                                                ],
                                          },
                                    ],
                              }
                        );
                        const hot_categories = await db.new_category.findAll({
                              attributes: ["name", "slug", "slug_crc"],
                              include: [
                                    {
                                          model: db.new_articles_hot_category,
                                          attributes: [
                                                "article_id",
                                                "position",
                                          ],
                                          limit: 3,
                                          order: [["position", "ASC"]],
                                          include: [
                                                {
                                                      model: db.new_article,
                                                      attributes: [
                                                            "avatar",
                                                            "title",
                                                      ],
                                                },
                                          ],
                                    },
                              ],
                        });
                        resolve({
                              hot_main,
                              hot_categories,
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
      getByCateService: (slug, slug_crc) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        // const checkcrc = await db.new_category.findOne({
                        //       where: [{ slug_crc }],
                        // });
                        // console.log(slug_crc);
                        if (1) {
                              const checkSlug = await db.new_category.findOne({
                                    where: [
                                          {
                                                slug,
                                          },
                                    ],
                              });
                              if (checkSlug) {
                                    const articles_category =
                                          await db.new_category.findOne({
                                                where: [{ slug }],
                                                attributes: [
                                                      "name",
                                                      "id",
                                                      "slug",
                                                      "slug_crc",
                                                ],
                                                include: [
                                                      {
                                                            model: db.new_articles_category,
                                                            attributes: [
                                                                  "article_id",
                                                            ],
                                                            include: [
                                                                  {
                                                                        model: db.new_article,
                                                                        attributes:
                                                                              [
                                                                                    "title",
                                                                                    "slug",
                                                                                    "slug_crc",
                                                                              ],
                                                                  },
                                                            ],
                                                      },
                                                      {
                                                            model: db.new_category,
                                                            as: "childCategories",
                                                            attributes: [
                                                                  "name",
                                                                  "slug",
                                                                  "slug_crc",
                                                            ],
                                                            include: [
                                                                  {
                                                                        model: db.new_articles_category,
                                                                        attributes:
                                                                              [
                                                                                    "article_id",
                                                                              ],
                                                                        include: [
                                                                              {
                                                                                    model: db.new_article,
                                                                                    attributes:
                                                                                          [
                                                                                                "title",
                                                                                                "slug",
                                                                                                "slug_crc",
                                                                                          ],
                                                                              },
                                                                        ],
                                                                  },
                                                            ],
                                                      },
                                                ],
                                          });
                                    const hotNewCates =
                                          await db.new_category.findAll({
                                                where: {
                                                      slug,
                                                },
                                                attributes: [
                                                      "name",
                                                      "slug",
                                                      "slug_crc",
                                                ],
                                                include: [
                                                      {
                                                            model: db.new_articles_hot_category,
                                                            attributes: [
                                                                  "article_id",
                                                                  "position",
                                                            ],
                                                            limit: 4,
                                                            order: [
                                                                  [
                                                                        "position",
                                                                        "ASC",
                                                                  ],
                                                            ],
                                                            include: [
                                                                  {
                                                                        model: db.new_article,
                                                                        attributes:
                                                                              [
                                                                                    "avatar",
                                                                                    "title",
                                                                                    "sapo",
                                                                              ],
                                                                  },
                                                            ],
                                                      },
                                                ],
                                          });
                                    resolve({
                                          articles_category,
                                          hotNewCates,
                                          status: 0,
                                    });
                              }
                        } else {
                              resolve({ message: "Khong tim thay danh muc" });
                        }
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      createArticleService: (data) => {
            return new Promise(async (resolve, reject) => {
                  const slug_crc = crc32(data.slug);
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
                                    slug_crc,
                              });
                              const article = await db.new_article.findOne({
                                    where: {
                                          slug_crc,
                                    },
                              });
                              console.log(article);
                              const res = await db.new_articles_category.create(
                                    {
                                          article_id: article.id,
                                          category_id: data.category_id,
                                    }
                              );

                              resolve({
                                    status: 0,
                                    message: "Đã thêm bài viết thành công",
                                    response,
                              });
                        }
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      getDetailService: (slug, slug_crc) => {
            return new Promise(async (resolve, reject) => {
                  const checkslugsrc = await db.new_article.findOne({
                        where: [
                              {
                                    slug_crc,
                              },
                        ],
                  });
                  if (checkslugsrc !== null) {
                        const article = await db.new_article.findOne({
                              where: [
                                    {
                                          slug: slug,
                                    },
                              ],
                        });

                        if (article !== null) {
                              const view = await db.new_article.update(
                                    {
                                          views: article.views + 1,
                                    },
                                    {
                                          where: [{ id: article.id }],
                                    }
                              );
                              const res =
                                    await db.new_articles_category.findOne({
                                          where: [
                                                {
                                                      article_id:
                                                            article.id || 0,
                                                },
                                          ],
                                    });

                              const category = await db.new_category.findOne({
                                    where: [
                                          {
                                                id: res?.category_id,
                                          },
                                    ],
                                    attributes: ["name", "id", "slug"],
                              });
                              const cateChild = await db.new_category.findOne({
                                    where: [
                                          {
                                                parent_id: res.category_id,
                                          },
                                    ],
                                    attributes: ["name", "id", "slug"],
                              });
                              const articlesCate =
                                    await db.new_category.findAll({
                                          attributes: ["name", "id", "slug"],
                                          where: [
                                                {
                                                      parent_id: null,
                                                },
                                          ],
                                          include: [
                                                {
                                                      model: db.new_category,
                                                      as: "childCategories",
                                                      attributes: [
                                                            "name",
                                                            "id",
                                                            "slug",
                                                      ],
                                                      include: [
                                                            {
                                                                  model: db.new_articles_category,
                                                                  attributes: [
                                                                        "article_id",
                                                                        "category_id",
                                                                  ],
                                                                  include: [
                                                                        {
                                                                              model: db.new_article,
                                                                              attributes:
                                                                                    [
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
                                                {
                                                      model: db.new_articles_category,
                                                      attributes: [
                                                            "article_id",
                                                            "category_id",
                                                      ],
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

                              resolve({
                                    article,
                                    articlesCate,

                                    cateChild,
                              });
                        } else {
                              resolve({ message: "Khong tim thay bai viet" });
                        }
                  } else {
                        resolve({ message: "Khong tim thay bai viet" });
                  }
            });
      },
      publishService: (id) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        const now = new Date();
                        const check = await db.new_article.findOne({
                              where: {
                                    id,
                                    status: 0,
                              },
                        });
                        if (check) {
                              const response = await db.new_article.update(
                                    {
                                          publishAt: now,
                                          status: 1,
                                    },
                                    {
                                          where: [{ id }],
                                    }
                              );
                              if (response[0]) {
                                    resolve({
                                          message: "Xuat ban thanh cong",
                                          status: 0,
                                    });
                              }
                        }
                        resolve({
                              message: "Xuat ban khong thanh cong",
                              status: 1,
                        });
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      createHotMain: (data) => {
            return new Promise(async (resolve, reject) => {
                  // check position invalid
                  if (data.position < 1 && data.position > 8) {
                        resolve({
                              message: "Vi tri set bai hot phai nho hon 8",
                        });
                  }
                  // Check tại vị trí đó còn trống không
                  const checkPosition = await db.new_articles_hot_main.findOne({
                        where: { position: data.position },
                  });
                  // Check id bài viết đó đã được set tin hot
                  const checkArticle = await db.new_articles_hot_main.findOne({
                        where: { article_id: data.article_id },
                  });
                  if (checkPosition === null) {
                        if (checkArticle === null) {
                              const response =
                                    await db.new_articles_hot_main.create({
                                          ...data,
                                    });
                              resolve(response);
                        }
                        resolve({
                              message: "Bàn viết này đã được set trong tin nổi bật",
                        });
                  } else {
                        resolve({ message: "Vị trí đã có bài viết" });
                  }
            });
      },
      createHotCate: (data) => {
            return new Promise(async (resolve, reject) => {
                  const checkArticle = await db.new_article.findOne({
                        where: [
                              {
                                    id: data.article_id,
                              },
                        ],
                  });
                  if (checkArticle === null) {
                        const checkArticle =
                              await db.new_articles_hot_main.findOne({
                                    where: { article_id: data.article_id },
                              });
                        if (checkArticle === null) {
                              const categoryNew = await db.new_category.findOne(
                                    {
                                          where: {
                                                article_id: data.article_id,
                                          },
                                    }
                              );
                              const response =
                                    await db.new_articles_hot_category.create({
                                          ...data,
                                          category_id: categoryNew.category_id,
                                    });
                              resolve(response);
                        }
                        resolve({
                              message: "Bàn viết này đã được set trong tin nổi bật",
                        });
                  } else {
                        resolve({ message: "Failed to create" });
                  }
            });
      },
      updateHotMain: (data) => {
            return new Promise(async (resolve, reject) => {
                  const response = await db.new_articles_hot_main.update(
                        {
                              position: data.position,
                        },
                        { where: { article_id: data.article_id } }
                  );
                  if (response !== null) {
                        resolve({ message: "Cập nhật vị trí thành công" });
                  }

                  resolve({ message: "Cập nhật vị trí không thành công" });
            });
      },
      getByView: () => {
            return new Promise(async (resolve, reject) => {
                  const res = await db.new_article.findAll({
                        order: [["views", "DESC"]],
                        attributes: [
                              "title",
                              "avatar",
                              "slug",
                              "slug_crc",
                              "views",
                        ],
                        limit: 5,
                        include: [
                              {
                                    model: db.new_articles_category,
                                    as: "article_category",
                                    attributes: ["category_id"],
                                    include: [
                                          {
                                                model: db.new_category,
                                                as: "dataCategory",
                                                attributes: [
                                                      "name",
                                                      "slug",
                                                      "slug_crc",
                                                ],
                                          },
                                    ],
                              },
                        ],
                  });
                  resolve(res);
            });
      },
      getByPublishAt: () => {
            try {
                  return new Promise(async (resolve, reject) => {
                        const res = await db.new_article.findAll({
                              order: [["publishAt", "DESC"]],
                              attributes: [
                                    "title",
                                    "avatar",
                                    "slug",
                                    "slug_crc",
                                    "sapo",
                                    "publishAt",
                              ],
                              limit: 20,
                        });

                        resolve(res);
                  });
            } catch (error) {
                  reject(error);
            }
      },
      getByViewCategory: (id) => {
            return new Promise(async (resolve, reject) => {
                  const res = await db.new_category.findAll({
                        where: {
                              id,
                        },
                        include: {
                              model: db.new_category,
                              as: "childCategories",
                        },
                  });

                  resolve(res);
            });
      },
};

module.exports = articlesService;
