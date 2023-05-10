const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const articlesService = {
      getAllService: (req, res) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        resolve({
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
                                    const articlesCate =
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
                                                ],
                                          });

                                    resolve({
                                          articlesCate,
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
                              const res = await db.new_articles_category.create(
                                    {
                                          article_id: response.id,
                                          category_id: data.category_id,
                                    }
                              );

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
                              const res =
                                    await db.new_articles_category.findOne({
                                          where: [
                                                {
                                                      article_id: article.id,
                                                },
                                          ],
                                    });
                              const category = await db.new_category.findOne({
                                    where: [
                                          {
                                                id: res.category_id,
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
                                    category,
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

                        const response = await db.new_article.update(
                              {
                                    publishAt: now,
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
                        } else {
                              resolve({
                                    message: "Xuat ban khong thanh cong",
                                    status: 1,
                              });
                        }
                  } catch (error) {
                        reject(error);
                  }
            });
      },
      setHotNews: (data) => {
            return new Promise(async (resolve, reject) => {
                  console.log(db.new_articles_hot_main);
                  const response = await db.new_articles_hot_category.findAll();
                  resolve(response);
            });
      },
};

module.exports = articlesService;
