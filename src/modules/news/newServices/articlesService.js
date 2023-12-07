const db = require("../../../config/newModels");
const dbUser = require("../../../config/userModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const fs = require("fs");
require("dotenv").config();
const sharp = require("sharp");
const axios = require("axios");
const asyncHandler = require("express-async-handler");
const { articels } = require("../../../untils/dataDemo");
const articlesService = {
      guest: {
            get: {
                  getHotService: async (req, res) => {
                        try {
                              const res = await db.new_category.findAll({
                                    where: {
                                          status: 0,
                                    },
                                    include: [
                                          {
                                                model: db.new_articles_category,
                                                as: "articles",
                                                attributes: ["article_id"],
                                          },
                                    ],
                              });
                              let articles = [];
                              res.map((cate) => {
                                    cate?.articles.map((item) => {
                                          articles.push(item.article_id);
                                    });
                              });

                              const hot_main =
                                    await db.new_articles_hot_main.findAll({
                                          order: [["position", "ASC"]],
                                          attributes: [
                                                "article_id",
                                                "position",
                                          ],

                                          include: [
                                                {
                                                      model: db.new_article,
                                                      where: {
                                                            status: 1,
                                                            id: {
                                                                  [Op.notIn]:
                                                                        articles,
                                                            },
                                                      },
                                                      require: true,
                                                      attributes: [
                                                            "avatar",
                                                            "title",
                                                            "sapo",
                                                            "slug",
                                                            "slug_crc",
                                                            "id",
                                                      ],
                                                },
                                          ],
                                    });
                              return {
                                    hot_main,
                                    articles,
                              };
                        } catch (error) {
                              return error;
                        }
                  },
                  getDetailService: asyncHandler(async (slug, slug_crc) => {
                        const res = await db.new_category.findAll({
                              where: {
                                    status: 0,
                              },
                              include: [
                                    {
                                          model: db.new_articles_category,
                                          as: "articles",
                                          attributes: ["article_id"],
                                    },
                              ],
                        });
                        let articles = [];
                        res.map((cate) => {
                              cate?.articles.map((item) => {
                                    articles.push(item.article_id);
                              });
                        });

                        const check = await db.new_article.findOne({
                              where: [
                                    {
                                          slug_crc,
                                          id: { [Op.notIn]: articles },
                                    },
                              ],
                        });

                        if (check !== null) {
                              const article = await db.new_article.findOne({
                                    where: [
                                          {
                                                slug: slug,
                                          },
                                    ],
                              });
                              if (article !== null) {
                                    await db.new_article.update(
                                          {
                                                views: article.views + 1,
                                          },
                                          {
                                                where: [
                                                      {
                                                            id: article.id,
                                                      },
                                                ],
                                          }
                                    );
                                    const category =
                                          await db.new_articles_category.findAll(
                                                {
                                                      where: {
                                                            article_id:
                                                                  article.id,
                                                      },
                                                      include: {
                                                            as: "category",
                                                            model: db.new_category,
                                                      },
                                                      order: [
                                                            [
                                                                  {
                                                                        model: "category",
                                                                  },
                                                                  "parent_id",
                                                                  "ASC",
                                                            ],
                                                      ],
                                                }
                                          );
                                    return {
                                          article,
                                          category,
                                    };
                              } else {
                                    return {
                                          message: "Khong tim thay bai viet",
                                    };
                              }
                        } else {
                              return { message: "Khong tim thay bai viet" };
                        }
                  }),
                  getByTitleService: async ({ title, category_id, page }) => {
                        try {
                              const res = await db.new_category.findAll({
                                    where: {
                                          status: 0,
                                    },
                                    include: [
                                          {
                                                model: db.new_articles_category,
                                                as: "articles",
                                                attributes: ["article_id"],
                                          },
                                    ],
                              });
                              let articlesBlock = [];
                              res.map((cate) => {
                                    cate?.articles.map((item) => {
                                          articlesBlock.push(item.article_id);
                                    });
                              });
                              console.log(articlesBlock);
                              let queries = {};
                              (queries.limit = +process.env.LIMIT),
                                    (queries.offset =
                                          (page - 1) * +process.env.LIMIT);
                              if (category_id) {
                                    const articles =
                                          await db.new_articles_category.findAll(
                                                {
                                                      where: {
                                                            category_id,
                                                      },
                                                      include: {
                                                            model: db.new_article,
                                                            require: true,
                                                            where: {
                                                                  title: {
                                                                        [Op.like]: `%${title}%`,
                                                                  },
                                                                  id: {
                                                                        [Op.notIn]:
                                                                              articlesBlock,
                                                                  },
                                                                  status: 1,
                                                            },
                                                      },
                                                      limit: 10,
                                                }
                                          );
                                    return articles;
                              } else {
                                    const articles =
                                          await db.new_article.findAndCountAll({
                                                where: {
                                                      title: {
                                                            [Op.like]: `%${title}%`,
                                                      },
                                                      id: {
                                                            [Op.notIn]:
                                                                  articlesBlock,
                                                      },
                                                      status: 1,
                                                },
                                                ...queries,
                                                order: [["publishAt", "DESC"]],
                                          });
                                    return {
                                          data: articles,
                                          status: 0,
                                    };
                              }
                        } catch (error) {
                              return error;
                        }
                  },
                  getByMostView: async (slug_crc) => {
                        var list_article_most_views;
                        try {
                              const res = await db.new_category.findAll({
                                    where: {
                                          status: 0,
                                    },
                                    include: [
                                          {
                                                model: db.new_articles_category,
                                                as: "articles",
                                                attributes: ["article_id"],
                                          },
                                    ],
                              });
                              let articlesBlock = [];
                              res.map((cate) => {
                                    cate?.articles.map((item) => {
                                          articlesBlock.push(item.article_id);
                                    });
                              });
                              if (slug_crc) {
                                    const idCate =
                                          await db.new_category.findOne({
                                                where: [
                                                      {
                                                            slug_crc,
                                                      },
                                                ],
                                                attributes: [
                                                      "id",
                                                      "slug",
                                                      "slug_crc",
                                                      "parent_id",
                                                      "name",
                                                ],
                                          });
                                    const listCate =
                                          await db.new_category.findAll({
                                                where: {
                                                      [Op.or]: {
                                                            id: idCate.id,
                                                            parent_id:
                                                                  idCate.id,
                                                      },
                                                },
                                          });
                                    let listId;
                                    listId = listCate.map((cate) => cate.id);
                                    if (idCate) {
                                          const list_article =
                                                await db.new_articles_category.findAll(
                                                      {
                                                            where: {
                                                                  category_id:
                                                                        listId,
                                                            },
                                                      }
                                                );
                                          const listIdArticles =
                                                list_article.map(
                                                      (article) =>
                                                            article.article_id
                                                );
                                          list_article_most_views =
                                                await db.new_article.findAll({
                                                      where: [
                                                            {
                                                                  id: {
                                                                        [Op.notIn]:
                                                                              articlesBlock,
                                                                        [Op.in]:
                                                                              listIdArticles,
                                                                  },
                                                                  status: 1,
                                                            },
                                                      ],
                                                      limit: 5,
                                                      attributes: [
                                                            "avatar",
                                                            "slug",
                                                            "slug_crc",
                                                            "title",
                                                            "views",
                                                            "id",
                                                      ],
                                                      order: [
                                                            ["views", "DESC"],
                                                      ],

                                                      include: [
                                                            {
                                                                  model: db.new_articles_category,
                                                                  attributes: [
                                                                        "category_id",
                                                                  ],
                                                                  include: [
                                                                        {
                                                                              as: "category",
                                                                              model: db.new_category,
                                                                              attributes:
                                                                                    [
                                                                                          "name",
                                                                                          "slug",
                                                                                          "slug_crc",
                                                                                          "parent_id",
                                                                                    ],
                                                                        },
                                                                  ],
                                                            },
                                                      ],
                                                });
                                    }
                              } else {
                                    list_article_most_views =
                                          await db.new_article.findAll({
                                                where: [
                                                      {
                                                            id: {
                                                                  [Op.notIn]:
                                                                        articlesBlock,
                                                            },
                                                            status: 1,
                                                      },
                                                ],
                                                limit: 5,
                                                attributes: [
                                                      "avatar",
                                                      "slug",
                                                      "slug_crc",
                                                      "title",
                                                      "views",
                                                ],
                                                order: [["views", "DESC"]],

                                                include: [
                                                      {
                                                            model: db.new_articles_category,
                                                            attributes: [
                                                                  "category_id",
                                                            ],
                                                            include: [
                                                                  {
                                                                        as: "category",
                                                                        model: db.new_category,
                                                                        attributes:
                                                                              [
                                                                                    "name",
                                                                                    "slug",
                                                                                    "slug_crc",
                                                                              ],
                                                                  },
                                                            ],
                                                      },
                                                ],
                                          });
                              }
                              return list_article_most_views;
                        } catch (error) {
                              console.log(error);
                        }
                  },
                  getByPublishAt: asyncHandler(
                        async ({ page = 1, slug_crc }) => {
                              let list_article_new;
                              let queries = {};

                              (queries.limit = +process.env.LIMIT),
                                    (queries.offset =
                                          (page - 1) * +process.env.LIMIT);
                              if (!slug_crc) {
                                    const res = await db.new_category.findAll({
                                          where: {
                                                status: 0,
                                          },
                                          include: [
                                                {
                                                      model: db.new_articles_category,
                                                      as: "articles",
                                                      attributes: [
                                                            "article_id",
                                                      ],
                                                },
                                          ],
                                    });
                                    let articlesBlock = [];
                                    res.map((cate) => {
                                          cate?.articles.map((item) => {
                                                articlesBlock.push(
                                                      item.article_id
                                                );
                                          });
                                    });

                                    list_article_new =
                                          await db.new_article.findAndCountAll({
                                                ...queries,
                                                where: {
                                                      status: 1,
                                                      id: {
                                                            [Op.notIn]:
                                                                  articlesBlock,
                                                      },
                                                },
                                                distinct: true,
                                                include: [
                                                      {
                                                            model: db.new_articles_category,

                                                            include: [
                                                                  {
                                                                        model: db.new_category,
                                                                        as: "category",
                                                                  },
                                                            ],
                                                      },
                                                ],
                                                order: [["publishAt", "DESC"]],
                                          });
                              } else {
                                    const res = await db.new_category.findAll({
                                          where: {
                                                status: 0,
                                          },
                                          include: [
                                                {
                                                      model: db.new_articles_category,
                                                      as: "articles",
                                                      attributes: [
                                                            "article_id",
                                                      ],
                                                },
                                          ],
                                    });
                                    const res1 = await db.new_category.findAll({
                                          where: {
                                                slug_crc,
                                          },
                                          include: [
                                                {
                                                      model: db.new_articles_hot_category,
                                                      attributes: [
                                                            "article_id",
                                                      ],
                                                },
                                          ],
                                    });
                                    let articlesBlock = [];
                                    res.map((cate) => {
                                          cate?.articles.map((item) => {
                                                articlesBlock.push(
                                                      item.article_id
                                                );
                                          });
                                    });
                                    res1.map((cate) => {
                                          cate?.new_articles_hot_categories.map(
                                                (item) => {
                                                      articlesBlock.push(
                                                            item.article_id
                                                      );
                                                }
                                          );
                                    });
                                    const idCate =
                                          await db.new_category.findOne({
                                                where: [{ slug_crc }],
                                                attributes: [
                                                      "id",
                                                      "slug",
                                                      "slug_crc",
                                                      "parent_id",
                                                      "name",
                                                ],
                                          });
                                    if (idCate) {
                                          list_article_new =
                                                await db.new_articles_category.findAll(
                                                      {
                                                            ...queries,
                                                            distinct: true,
                                                            where: {
                                                                  category_id:
                                                                        idCate.id,
                                                            },
                                                            include: [
                                                                  {
                                                                        model: db.new_article,
                                                                        require: true,
                                                                        where: {
                                                                              status: 1,
                                                                              id: {
                                                                                    [Op.notIn]:
                                                                                          articlesBlock,
                                                                              },
                                                                        },
                                                                  },
                                                            ],
                                                            order: [
                                                                  [
                                                                        db.new_article,
                                                                        "publishAt",
                                                                        "DESC",
                                                                  ],
                                                            ],
                                                      }
                                                );
                                    }
                              }
                              return list_article_new;
                        }
                  ),
                  getAvatarService: async ({ slug_crc, height, width }) => {
                        try {
                              const path = `${process.env.PATH_UPLOAD_AVATAR}${slug_crc}.png`;
                              const avatarBuffer = await sharp(path)
                                    .resize(parseInt(height), parseInt(width))
                                    .toBuffer();
                              return avatarBuffer;
                        } catch (error) {
                              console.log(error);
                        }
                        // C:\Users\PC\Desktop\backend-learn-test\src\uploadFile\avatars\87802742.png
                  },
                  getHotBoxSubCategoryService: asyncHandler(
                        async (slug_crc) => {
                              let res;
                              if (!slug_crc) {
                                    res = await db.new_category.findAll({
                                          where: {
                                                parent_id: null,
                                          },
                                          attributes: [
                                                "name",
                                                "slug",
                                                "slug_crc",
                                                "id",
                                          ],
                                          include: {
                                                model: db.new_articles_hot_category,
                                                include: {
                                                      model: db.new_article,
                                                },
                                          },
                                    });
                              } else {
                                    const parent =
                                          await db.new_category.findOne({
                                                where: { slug_crc },
                                          });
                                    res = await db.new_category.findAll({
                                          where: {
                                                parent_id: parent.id,
                                          },
                                          attributes: [
                                                "name",
                                                "slug",
                                                "slug_crc",
                                                "id",
                                          ],
                                          include: [
                                                {
                                                      model: db.new_articles_hot_category,
                                                      attributes: [
                                                            "article_id",
                                                            "position",
                                                      ],
                                                      order: [
                                                            ["position", "ASC"],
                                                      ],
                                                      include: [
                                                            {
                                                                  model: db.new_article,
                                                                  attributes: [
                                                                        "avatar",
                                                                        "slug",
                                                                        "slug_crc",
                                                                        "title",
                                                                        "sapo",
                                                                  ],
                                                            },
                                                      ],
                                                },
                                          ],
                                    });
                              }
                              res.map((item) => {
                                    item.new_articles_hot_categories.map(
                                          (article) => {
                                                if (
                                                      fs.existsSync(
                                                            `src/uploadFile/avatars/${
                                                                  article
                                                                        .new_article
                                                                        .avatar +
                                                                  ".png"
                                                            }`
                                                      )
                                                ) {
                                                      const imageUrl = `http://localhost:4000/${article.new_article.avatar}.png`;
                                                      article.new_article.avatar =
                                                            imageUrl;
                                                } else {
                                                }
                                          }
                                    );
                              });
                              return res;
                        }
                  ),
                  getHotCategoryService: asyncHandler(async (slug_crc) => {
                        const check = await db.new_category.findOne({
                              where: { slug_crc, status: 1 },
                        });
                        if (check) {
                              const res = await db.new_category.findAll({
                                    where: {
                                          status: 0,
                                    },
                                    include: [
                                          {
                                                model: db.new_articles_category,
                                                as: "articles",
                                                attributes: ["article_id"],
                                          },
                                    ],
                              });
                              let articlesBlock = [];
                              res.map((cate) => {
                                    cate?.articles.map((item) => {
                                          articlesBlock.push(item.article_id);
                                    });
                              });
                              const articles = await db.new_category.findOne({
                                    where: {
                                          slug_crc,
                                    },
                                    order: [
                                          [
                                                db.new_articles_hot_category,
                                                "position",
                                                "ASC",
                                          ],
                                    ],
                                    include: [
                                          {
                                                model: db.new_articles_hot_category,
                                                include: [
                                                      {
                                                            model: db.new_article,
                                                            where: {
                                                                  status: 1,
                                                                  id: {
                                                                        [Op.notIn]:
                                                                              articlesBlock,
                                                                  },
                                                            },
                                                            require: true,
                                                      },
                                                ],
                                          },
                                    ],
                              });

                              return articles;
                        } else {
                              return {
                                    status: 0,
                              };
                        }
                  }),
            },
      },
      admin: {
            get: {
                  getAllService: async ({
                        page = 1,
                        category_id,
                        order,
                        user_id,
                        role_id,
                        limit,
                        ...query
                  }) => {
                        let queries = {};
                        if (query.title && query.title !== "") {
                              query.title = {
                                    [Op.substring]: query.title,
                              };
                        } else {
                              delete query.title;
                        }
                        if (limit) {
                              (queries.limit = +limit),
                                    (queries.offset =
                                          (page - 1) * queries.limit);
                        } else {
                              (queries.limit = +process.env.LIMIT),
                                    (queries.offset =
                                          (page - 1) * queries.limit);
                        }

                        if (order) queries.order = JSON.parse(order);
                        let whereCondition = { ...query };
                        if (query.publishAt) {
                              whereCondition.publishAt = {
                                    [Op.between]: query.publishAt,
                              };
                        }
                        try {
                              let articles;
                              if (category_id) {
                                    let articlesId =
                                          await db.new_articles_category.findAll(
                                                {
                                                      where: {
                                                            category_id,
                                                      },
                                                      attributes: [
                                                            "article_id",
                                                      ],
                                                }
                                          );
                                    articlesId = articlesId.map(
                                          (item) => item.article_id
                                    );
                                    whereCondition = {
                                          ...whereCondition,
                                          id: {
                                                [Op.in]: articlesId,
                                          },
                                    };
                              }
                              switch (role_id) {
                                    case 2: // Editor
                                          whereCondition.created_user_id =
                                                user_id;
                                          break;
                                    default:
                                          if (query?.created_user_id) {
                                                whereCondition.created_user_id =
                                                      query.created_user_id;
                                          }
                                          break;
                              }
                              articles = await db.new_article.findAndCountAll({
                                    ...queries,
                                    where: whereCondition,
                                    order: [["updatedAt", "DESC"]],
                                    attributes: {
                                          exclude: ["content"],
                                    },
                                    include: [
                                          {
                                                model: db.new_articles_category,

                                                include: [
                                                      {
                                                            model: db.new_category,
                                                            as: "category",
                                                      },
                                                ],
                                          },
                                          {
                                                model: dbUser.User,
                                                attributes: [
                                                      "name",
                                                      "userName",
                                                      "id",
                                                ],
                                          },
                                    ],
                                    distinct: true,
                              });
                              return articles;
                        } catch (error) {
                              console.log(error);
                              return {
                                    message: "Failed to get articles",
                              };
                        }
                  },
                  getHotService: async (data) => {
                        try {
                              let hot_news;
                              if (data.slug_crc == 1) {
                                    hot_news =
                                          await db.new_articles_hot_main.findAll(
                                                {
                                                      order: [
                                                            ["position", "ASC"],
                                                      ],
                                                      attributes: [
                                                            "article_id",
                                                            "position",
                                                      ],
                                                      include: [
                                                            {
                                                                  model: db.new_article,
                                                                  attributes: [
                                                                        "avatar",
                                                                        "title",
                                                                        "sapo",
                                                                        "slug",
                                                                        "slug_crc",
                                                                        "id",
                                                                  ],
                                                            },
                                                      ],
                                                }
                                          );
                              } else {
                                    const res = await db.new_category.findOne({
                                          where: {
                                                slug_crc: data.slug_crc,
                                          },
                                          order: [
                                                [
                                                      db.new_articles_hot_category,
                                                      "position",
                                                      "ASC",
                                                ],
                                          ],
                                          include: [
                                                {
                                                      model: db.new_articles_hot_category,
                                                      include: [
                                                            {
                                                                  model: db.new_article,
                                                                  require: true,
                                                            },
                                                      ],
                                                },
                                          ],
                                    });
                                    hot_news = res.new_articles_hot_categories;
                              }

                              return hot_news;
                        } catch (error) {
                              return error;
                        }
                  },
            },
            update: {
                  updateHotMain: async (data) => {
                        try {
                              const t = await db.sequelize.transaction();
                              await db.new_articles_hot_main.destroy(
                                    {
                                          where: {},
                                    },
                                    {
                                          transaction: t,
                                    }
                              );
                              await db.new_articles_hot_main.bulkCreate(data, {
                                    transaction: t,
                              });
                              await t.commit();
                        } catch (error) {
                              return {
                                    message: "Cập nhật vị trí không thành công",
                                    status: 0,
                              };
                        }
                  },
                  updateHotCate: async (data, category_id) => {
                        try {
                              await db.new_articles_hot_category.destroy({
                                    where: { category_id },
                              });
                              data.map((item) => {
                                    item.category_id = category_id;
                              });
                              await db.new_articles_hot_category.bulkCreate(
                                    data
                              );
                        } catch (error) {
                              console.log(error);
                        }
                  },
                  updateArticleService: async (article_id, data, file) => {
                        try {
                              const now = new Date();
                              let infor = null;
                              if (data.status === 0 || !data.status) {
                                    infor = {
                                          ...data,
                                          publishAt: now,
                                    };
                              } else {
                                    infor = {
                                          ...data,
                                          publishAt: now,
                                    };
                              }
                              if (file) {
                                    const ext = file.originalname
                                          .split(".")
                                          .pop();
                                    const newFilePath = `src/uploadFile/avatars/${
                                          data.slug_crc + "." + ext
                                    }`;
                                    fs.rename(
                                          file.path,
                                          newFilePath,
                                          (error) => {
                                                console.log("error", error);
                                          }
                                    );
                              }
                              if (data.category_id) {
                                    await db.new_article.update(
                                          {
                                                ...infor,
                                          },
                                          {
                                                where: {
                                                      id: article_id,
                                                },
                                          }
                                    );
                                    const hotCate =
                                          await db.new_articles_hot_category.findOne(
                                                {
                                                      where: {
                                                            article_id,
                                                      },
                                                }
                                          );
                                    const hotMain =
                                          await db.new_articles_hot_main.findOne(
                                                {
                                                      where: {
                                                            article_id,
                                                      },
                                                }
                                          );

                                    if (!hotMain && !hotCate) {
                                          await db.new_articles_category.destroy(
                                                {
                                                      where: {
                                                            article_id,
                                                      },
                                                },
                                                t
                                          );
                                          const category =
                                                await db.new_category.findOne({
                                                      where: {
                                                            id: data.category_id,
                                                      },
                                                });

                                          await db.new_articles_category.create(
                                                {
                                                      category_id:
                                                            data.category_id,
                                                      article_id,
                                                },
                                                t
                                          );
                                          if (category?.parent_id) {
                                                await db.new_articles_category.create(
                                                      {
                                                            category_id:
                                                                  category.parent_id,
                                                            article_id,
                                                      },
                                                      t
                                                );
                                          }
                                          return {
                                                message: "Xuat ban thanh cong",
                                                status: 0,
                                          };
                                    } else {
                                          return {
                                                message: "Bài viết đang được set nổi bật vui lòng gỡ trước khi chỉnh sửa",
                                          };
                                    }
                              } else {
                                    await db.new_article.update(
                                          {
                                                ...infor,
                                          },
                                          {
                                                where: {
                                                      id: article_id,
                                                },
                                          }
                                    );
                                    return {
                                          message: "Cập nhật thông tin bài viết thành công",
                                          status: 0,
                                    };
                              }
                        } catch (error) {
                              console.log(error);
                        }
                  },
                  publishArticlesSer: async (id, data, userId) => {
                        try {
                              if (!Array.isArray(id)) {
                                    id = [id]; // Chuyển đổi thành mảng nếu là số
                              }
                              const article = await db.new_article.findOne({
                                    where: { id },
                              });
                              if (!article.created_user_id) {
                                    await db.new_article.update(
                                          { created_user_id: userId },
                                          {
                                                where: {
                                                      id: {
                                                            [Op.in]: id,
                                                      },
                                                },
                                                attributes: ["avatar"],
                                          }
                                    );
                              }
                              await db.new_article.update(data, {
                                    where: {
                                          id: {
                                                [Op.in]: id,
                                          },
                                    },
                                    attributes: ["avatar"],
                              });
                              if (data.category_id) {
                                    await db.new_articles_category.destroy({
                                          where: {
                                                article_id: id,
                                          },
                                    });
                                    const category =
                                          await db.new_category.findOne({
                                                where: {
                                                      id: data.category_id,
                                                },
                                          });

                                    await db.new_articles_category.create({
                                          category_id: data.category_id,
                                          article_id: id,
                                    });
                                    if (category?.parent_id) {
                                          await db.new_articles_category.create(
                                                {
                                                      category_id:
                                                            category.parent_id,
                                                      article_id: id,
                                                }
                                          );
                                    }
                              }

                              return {
                                    message: "Đã cập nhật thành công",
                              };
                        } catch (error) {
                              console.log(error);
                        }
                  },
            },
            create: {
                  createHotService: async (data) => {
                        try {
                              if (!data.category_id) {
                                    await db.new_articles_hot_main.destroy({
                                          where: {},
                                    });
                                    await db.new_articles_hot_main.bulkCreate(
                                          data.articles
                                    );
                                    return {
                                          message: "Cập nhật vị trí thành công",
                                          status: 0,
                                    };
                              } else {
                                    await db.new_articles_hot_category.destroy({
                                          where: {
                                                category_id: data.category_id,
                                          },
                                    });
                                    data.articles.map((item) => {
                                          item.category_id = data.category_id;
                                    });
                                    await db.new_articles_hot_category.bulkCreate(
                                          data.articles
                                    );
                                    return {
                                          message: "Cập nhật vị trí thành công",
                                          status: 0,
                                    };
                              }
                        } catch (error) {
                              console.log(error.message);
                              return {
                                    message: "Cập nhật vị trí không thành công",
                                    status: 0,
                              };
                        }
                  },
                  createArticleService: async (file, data, user) => {
                        const slug_crc = crc32(data.slug);
                        const ext = file.originalname.split(".").pop();
                        const newFilePath = `src/uploadFile/avatars/${
                              slug_crc + "." + ext
                        }`;
                        sharp(file.path)
                              .resize(500, 500)
                              .toFile(newFilePath, (err, info) => {
                                    if (err) {
                                          console.error(
                                                "Error resizing image:",
                                                err
                                          );
                                    } else {
                                          console.log(
                                                "Image resized successfully:",
                                                info
                                          );
                                          fs.unlink(file.path, (err) => {
                                                if (err) {
                                                      console.error(
                                                            "Lỗi khi xóa tệp tin:",
                                                            err
                                                      );
                                                } else {
                                                      console.log(
                                                            "Tệp tin đã được xóa thành công."
                                                      );
                                                }
                                          });
                                    }
                              });
                        try {
                              const articel = await db.new_article.create({
                                    content: data.content,
                                    slug: data.slug,
                                    slug_crc,
                                    sapo: data.sapo,
                                    title: data.title,
                                    status: data.status,
                                    publishAt: new Date(data.publishAt),
                                    avatar: slug_crc,
                                    created_user_id: user.userId,
                                    views: 0,
                              });
                              const category = await db.new_category.findOne({
                                    where: {
                                          [Op.or]: {
                                                id: data.categoryId,
                                                parent_id: data.categoryId,
                                          },
                                    },
                                    attributes: [
                                          "name",
                                          "id",
                                          "slug",
                                          "parent_id",
                                    ],
                              });
                              const res = await db.new_articles_category.create(
                                    {
                                          category_id: +data.categoryId,
                                          article_id: articel.id,
                                    }
                              );
                              if (category?.parent_id) {
                                    let parent =
                                          await db.new_articles_category.create(
                                                {
                                                      category_id:
                                                            category.parent_id,
                                                      article_id: articel.id,
                                                }
                                          );
                              }
                              return {
                                    message: "Tạo bài viết mới thành công",
                                    status: 1,
                              };
                        } catch (error) {
                              console.log(error);
                              return {
                                    message: "Failed at articleService",
                              };
                        }
                  },
            },
            // insert: {
            //       insertDataService: async (cates, articels) => {
            //             try {
            //                   let position = 1;
            //                   for (let cate of cates) {
            //                         const slug_crc_cate = crc32(cate.slug);
            //                         const createCate =
            //                               await db.new_category.create({
            //                                     ...cate,
            //                                     status: 1,
            //                                     slug_crc: slug_crc_cate,
            //                                     position,
            //                               });
            //                         ++position;
            //                         for (let subCate of cate.sub) {
            //                               const slug_crc_subCate = crc32(
            //                                     subCate.slug
            //                               );
            //                               await db.new_category.create({
            //                                     ...subCate,
            //                                     status: 1,
            //                                     slug_crc: slug_crc_subCate,
            //                                     parent_id: createCate.id,
            //                               });
            //                         }
            //                   }
            //                   const imageDirectory = "/src/uploadFile/avatars";

            //                   async function downloadImage(
            //                         object,
            //                         name,
            //                         pathDir
            //                   ) {
            //                         const slug_crc = crc32(name);
            //                         try {
            //                               const response = await axios.get(
            //                                     object.avatar,
            //                                     {
            //                                           responseType:
            //                                                 "arraybuffer",
            //                                     }
            //                               );
            //                               const imageBuffer = Buffer.from(
            //                                     response.data,
            //                                     "binary"
            //                               );
            //                               const newFilePath = `src/uploadFile/avatars/${
            //                                     slug_crc + ".png"
            //                               }`;
            //                               fs.writeFileSync(
            //                                     newFilePath,
            //                                     imageBuffer
            //                               );
            //                               // sharp(Path)
            //                               //         .resize(500, 500)
            //                               //         .toFile(
            //                               //                 newFilePath,
            //                               //                 (err, info) => {
            //                               //                         if (
            //                               //                                 err
            //                               //                         ) {
            //                               //                                 console.error(
            //                               //                                         "Error resizing image:",
            //                               //                                         err
            //                               //                                 );
            //                               //                         } else {
            //                               //                                 console.log(
            //                               //                                         "Image resized successfully:",
            //                               //                                         info
            //                               //                                 );
            //                               //                                 fs.unlink(
            //                               //                                         Path,
            //                               //                                         (
            //                               //                                                 err
            //                               //                                         ) => {
            //                               //                                                 if (
            //                               //                                                         err
            //                               //                                                 ) {
            //                               //                                                         console.error(
            //                               //                                                                 "Lỗi khi xóa tệp tin:",
            //                               //                                                                 err
            //                               //                                                         );
            //                               //                                                 } else {
            //                               //                                                         console.log(
            //                               //                                                                 "Tệp tin đã được xóa thành công."
            //                               //                                                         );
            //                               //                                                 }
            //                               //                                         }
            //                               //                                 );
            //                               //                         }
            //                               //                 }
            //                               //         );
            //                         } catch (error) {
            //                               console.log(error);
            //                         }
            //                   }
            //                   for (let articel of articels) {
            //                         const subCate =
            //                               await db.new_category.findOne({
            //                                     where: {
            //                                           slug: articel.slug,
            //                                     },
            //                                     attributes: ["slug", "id"],
            //                                     include: [
            //                                           {
            //                                                 model: db.new_category,
            //                                                 attributes: [
            //                                                       "slug",
            //                                                       "id",
            //                                                 ],
            //                                                 as: "childCategories",
            //                                           },
            //                                     ],
            //                               });
            //                         for (
            //                               let i = 0;
            //                               i < articel.article.length;
            //                               i++
            //                         ) {
            //                               var newArticle;
            //                               const slug_crc = crc32(
            //                                     articel.article[i].slug
            //                               );
            //                               try {
            //                                     // await downloadImage(
            //                                     //         articel.article[
            //                                     //                 i
            //                                     //         ],
            //                                     //         articel.article[
            //                                     //                 i
            //                                     //         ].slug,
            //                                     //         imageDirectory
            //                                     // );
            //                                     const currentTime = new Date();

            //                                     const timestamp = currentTime
            //                                           .toISOString()
            //                                           .slice(0, 19)
            //                                           .replace("T", " ");
            //                                     newArticle =
            //                                           await db.new_article.create(
            //                                                 {
            //                                                       ...articel
            //                                                             .article[
            //                                                             i
            //                                                       ],
            //                                                       publishAt:
            //                                                             timestamp,
            //                                                       status: 1,
            //                                                       slug_crc,
            //                                                       avatar: slug_crc,
            //                                                       content: `<div class="title-detail" style="width: 700px; margin: 0px auto;">
            //                       <div class="title-detail" style="width: 700px; margin: 0px auto;">
            //                       <h1 class="title-detail">Những vấn đề chờ t&ograve;a ph&aacute;n quyết trong vụ 'chuyến bay giải cứu'</h1>
            //                       <p class="description" style="line-height: 1.4;"><span class="location-stamp"><span style="color: rgb(126, 140, 141);">H&Agrave; NỘI</span> - </span>Chiếc cặp đựng 450.000 USD tiền chạy &aacute;n hay chỉ 4 chai rượu vang, cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm &aacute;n so với h&igrave;nh phạt đề nghị tử h&igrave;nh... đang chờ t&ograve;a tuy&ecirc;n chiều nay.</p>
            //                       <article class="fck_detail">
            //                       <p class="Normal" style="line-height: 1.4;">Sau 6 ng&agrave;y nghỉ nghị &aacute;n, TAND H&agrave; Nội sẽ ra ph&aacute;n quyết sơ thẩm với 54 bị c&aacute;o trong vụ &aacute;n "chuyến bay giải cứu". Trong 12 ng&agrave;y x&eacute;t xử, hai bị c&aacute;o một mực k&ecirc;u oan l&agrave; Ho&agrave;ng Văn Hưng v&agrave; Trần Minh Tuấn (Gi&aacute;m đốc C&ocirc;ng ty Cổ phần x&acirc;y dựng Th&aacute;i H&ograve;a). Những bị c&aacute;o c&ograve;n lại thừa nhận to&agrave;n bộ hoặc một phần h&agrave;nh vi, mong được hưởng khoan hồng.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Đ&acirc;y l&agrave; vụ &aacute;n đặc biệt nghi&ecirc;m trọng, phức tạp, xảy ra trong bối cảnh Covid-19 b&ugrave;ng ph&aacute;t, c&aacute;c bị c&aacute;o l&agrave; quan chức v&agrave; chủ doanh nghiệp đ&atilde; lợi dụng t&igrave;nh h&igrave;nh dịch bệnh để trục lợi, VKS đ&aacute;nh gi&aacute;.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>Cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm nhẹ h&igrave;nh phạt?</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Bộ Y tế l&agrave; một trong 5 Bộ tham gia tổ c&ocirc;ng t&aacute;c thực hiện đưa c&ocirc;ng d&acirc;n về nước. Tại đ&acirc;y, Cục Y tế dự ph&ograve;ng được giao nhiệm vụ ph&ecirc; duyệt hoặc từ chối đề xuất của Bộ Ngoại giao về tần suất, số lượng chuyến bay giải cứu, ph&ugrave; hợp với t&igrave;nh h&igrave;nh dịch bệnh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo quy tr&igrave;nh, thứ trưởng y tế khi nhận được đề xuất tổ chức chuyến bay giải cứu, combo (người d&acirc;n phải tự nguyện trả ph&iacute; to&agrave;n bộ) hoặc kh&aacute;ch lẻ xin về nước sẽ chuyển cho Cục Y tế dự ph&ograve;ng tham mưu. Mọi trao đổi giữa cục v&agrave; thứ trưởng đều th&ocirc;ng qua Phạm Trung Ki&ecirc;n (thư k&yacute; của thứ trưởng).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Suốt qu&aacute; tr&igrave;nh x&eacute;t xử, bị c&aacute;o Ki&ecirc;n c&ugrave;ng Vũ Anh Tuấn (cựu ph&oacute; ph&ograve;ng tham mưu, Cục Quản l&yacute; xuất nhập cảnh, Bộ C&ocirc;ng an) l&agrave; hai người bị "nhắc" t&ecirc;n nhiều nhất khi nhiều chủ doanh nghiệp khai bị hai bị c&aacute;o n&agrave;y "l&agrave;m kh&oacute;" trong cấp ph&eacute;p chuyến bay nếu kh&ocirc;ng đưa tiền.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong 19 doanh nghiệp đưa hối lộ c&oacute; 12 c&ocirc;ng ty khai Ki&ecirc;n trực tiếp ra gi&aacute; 150-200 triệu đồng cho mỗi chuyến bay hoặc 1-2 triệu đồng mỗi h&agrave;nh kh&aacute;ch, theo c&aacute;o buộc.</p>
            //                       <figure class="tplCaption action_thumb_added" data-size="true">
            //                       <div class="fig-picture"><picture><source srcset="
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA  1x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA  2x
            //                                                                             " data-srcset="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA 1x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA 2x"> <img class="lazy lazied" src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" alt="Bị c&aacute;o Phạm Trung Ki&ecirc;n. Ảnh: Ngọc Th&agrave;nh" loading="lazy" data-src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" data-ll-status="loaded"></picture></div>
            //                       <figcaption>
            //                       <p class="Image">Bị c&aacute;o Phạm Trung Ki&ecirc;n trong ng&agrave;y đầu ti&ecirc;n của phi&ecirc;n t&ograve;a. Ảnh:&nbsp;<em>Ngọc Th&agrave;nh</em></p>
            //                       </figcaption>
            //                       </figure>
            //                       <p class="Normal" style="line-height: 1.4;">Ki&ecirc;n l&agrave; bị c&aacute;o duy nhất bị VKS&nbsp;<a href="https://vnexpress.net/vks-cuu-thu-ky-thu-truong-y-te-nhan-tien-trang-tron-nhat-4630149.html" rel="dofollow" data-itm-source="#vn_source=Detail-PhapLuat-4634933&amp;vn_campaign=Box-InternalLink&amp;vn_medium=Link-DeNghiAnTuHinh&amp;vn_term=Desktop&amp;vn_thumb=0" data-itm-added="1">đề nghị &aacute;n tử h&igrave;nh&nbsp;</a>với c&aacute;o buộc&nbsp;<em>Nhận hối lộ&nbsp;</em>"c&ocirc;ng khai, trắng trợn nhất", tổng 42,6 tỷ đồng, 253 lần, trong đ&oacute; 228 lần qua chuyển khoản. Ngo&agrave;i 12 tỷ đồng trả cho c&aacute;c doanh nghiệp trong giai đoạn điều tra v&agrave; 23 tỷ đồng đ&atilde; nộp trong giai đoạn x&eacute;t xử, gia đ&igrave;nh &ocirc;ng Ki&ecirc;n đ&atilde; nộp th&ecirc;m 7 tỷ đồng khi HĐXX nghị &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong phần tự b&agrave;o chữa, &ocirc;ng Ki&ecirc;n "nhận lỗi với nh&acirc;n d&acirc;n". Cho rằng mức &aacute;n VKS đề nghị "qu&aacute; nghiệt ng&atilde;", cựu thư k&yacute; thứ trưởng xin được hưởng mức phạt t&ugrave; c&oacute; thời hạn để sớm trở về với gia đ&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nghị quyết 03/2020 của Hội đồng thẩm ph&aacute;n TAND Tối cao đang được &aacute;p dụng, trong qu&aacute; tr&igrave;nh tố tụng, người phạm tội nhận hối lộ đ&atilde; chủ động nộp lại &iacute;t nhất ba phần tư t&agrave;i sản nhận hối lộ th&igrave; kh&ocirc;ng &aacute;p dụng mức cao nhất của khung h&igrave;nh phạt l&agrave; tử h&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>M&acirc;u thuẫn về tiền 'chạy &aacute;n'</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Khi vụ &aacute;n đang bị điều tra, một nh&oacute;m bốn bị c&aacute;o, trong đ&oacute; c&oacute; Ho&agrave;ng Văn Hưng cựu Trưởng ph&ograve;ng 5, Cơ quan An ninh Điều tra, Bộ C&ocirc;ng an v&agrave; cựu Ph&oacute; gi&aacute;m đốc C&ocirc;ng an H&agrave; Nội Nguyễn Anh Tuấn đ&atilde; "bắt tay" để chạy &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">&Ocirc;ng Hưng l&agrave; một trong hai bị c&aacute;o k&ecirc;u oan suốt những ng&agrave;y x&eacute;t xử.</p>
            //                       <p class="Normal" style="line-height: 1.4;">VKS c&aacute;o buộc, kết nối với điều tra vi&ecirc;n ch&iacute;nh của vụ &aacute;n l&agrave; Hưng, &ocirc;ng Tuấn đ&atilde; nhận 2,6 triệu USD để lo cho bị c&aacute;o L&ecirc; Hồng Sơn v&agrave; Nguyễn Thị Thanh Hằng (Tổng gi&aacute;m đốc v&agrave; Ph&oacute; tổng gi&aacute;m đốc C&ocirc;ng ty Bầu Trời Xanh).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nh&agrave; chức tr&aacute;ch, &ocirc;ng Hưng đ&atilde; "đưa th&ocirc;ng tin gian dối" để chiếm đoạt 800.000 USD của bị c&aacute;o Hằng, vậy c&ograve;n 1,8 triệu USD đang ở đ&acirc;u? Suốt phần x&eacute;t hỏi v&agrave; tranh luận, bị c&aacute;o Hưng nhiều lần đề nghị l&agrave;m r&otilde; số tiền "m&acirc;u thuẫn" n&agrave;y.</p>
            //                       <p class="Normal" style="line-height: 1.4;">"T&ocirc;i đề nghị VKS phải chứng minh số tiền 1,8 triệu USD đ&atilde; đi đ&acirc;u về đ&acirc;u, liệu c&oacute; phải &ocirc;ng Tuấn cũng lừa đảo kh&ocirc;ng?", bị c&aacute;o Hưng n&oacute;i v&agrave; đặt dấu hỏi rằng nếu &ocirc;ng Tuấn đ&atilde; nộp lại 1,8 triệu USD th&igrave; "c&oacute; phải cũng phạm tội lừa đảo chiếm đoạt t&agrave;i sản?".</p>
            //                       <p class="Normal" style="line-height: 1.4;">Hiện, &ocirc;ng Tuấn đ&atilde; nộp 1,85 triệu USD để khắc phục hậu quả v&agrave; l&agrave; người nộp lại tiền nhiều nhất trong 54 bị c&aacute;o.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Bị c&aacute;o Hưng bị VKS đề nghị 19-20 năm về tội&nbsp;<em>Lừa đảo chiếm đoạt t&agrave;i sản</em>, &ocirc;ng Tuấn bị đề nghị 5-6 năm về với c&aacute;o buộc&nbsp;<em>M&ocirc;i giới hối lộ&nbsp;</em>2,6 triệu USD, b&agrave; Hằng bị đề nghị 10-11 năm về tội&nbsp;<em>Đưa hối lộ.</em></p>
            //                       </article>
            //                       </div>
            //                       <h1 class="title-detail">Những vấn đề chờ t&ograve;a ph&aacute;n quyết trong vụ 'chuyến bay giải cứu'</h1>
            //                       <p class="description" style="line-height: 1.4;"><span class="location-stamp">H&Agrave; NỘI</span>Chiếc cặp đựng 450.000 USD tiền chạy &aacute;n hay chỉ 4 chai rượu vang, cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm &aacute;n so với h&igrave;nh phạt đề nghị tử h&igrave;nh... đang chờ t&ograve;a tuy&ecirc;n chiều nay.</p>
            //                       <article class="fck_detail">
            //                       <p class="Normal" style="line-height: 1.4;">Sau 6 ng&agrave;y nghỉ nghị &aacute;n, TAND H&agrave; Nội sẽ ra ph&aacute;n quyết sơ thẩm với 54 bị c&aacute;o trong vụ &aacute;n "chuyến bay giải cứu". Trong 12 ng&agrave;y x&eacute;t xử, hai bị c&aacute;o một mực k&ecirc;u oan l&agrave; Ho&agrave;ng Văn Hưng v&agrave; Trần Minh Tuấn (Gi&aacute;m đốc C&ocirc;ng ty Cổ phần x&acirc;y dựng Th&aacute;i H&ograve;a). Những bị c&aacute;o c&ograve;n lại thừa nhận to&agrave;n bộ hoặc một phần h&agrave;nh vi, mong được hưởng khoan hồng.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Đ&acirc;y l&agrave; vụ &aacute;n đặc biệt nghi&ecirc;m trọng, phức tạp, xảy ra trong bối cảnh Covid-19 b&ugrave;ng ph&aacute;t, c&aacute;c bị c&aacute;o l&agrave; quan chức v&agrave; chủ doanh nghiệp đ&atilde; lợi dụng t&igrave;nh h&igrave;nh dịch bệnh để trục lợi, VKS đ&aacute;nh gi&aacute;.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>Cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm nhẹ h&igrave;nh phạt?</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Bộ Y tế l&agrave; một trong 5 Bộ tham gia tổ c&ocirc;ng t&aacute;c thực hiện đưa c&ocirc;ng d&acirc;n về nước. Tại đ&acirc;y, Cục Y tế dự ph&ograve;ng được giao nhiệm vụ ph&ecirc; duyệt hoặc từ chối đề xuất của Bộ Ngoại giao về tần suất, số lượng chuyến bay giải cứu, ph&ugrave; hợp với t&igrave;nh h&igrave;nh dịch bệnh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo quy tr&igrave;nh, thứ trưởng y tế khi nhận được đề xuất tổ chức chuyến bay giải cứu, combo (người d&acirc;n phải tự nguyện trả ph&iacute; to&agrave;n bộ) hoặc kh&aacute;ch lẻ xin về nước sẽ chuyển cho Cục Y tế dự ph&ograve;ng tham mưu. Mọi trao đổi giữa cục v&agrave; thứ trưởng đều th&ocirc;ng qua Phạm Trung Ki&ecirc;n (thư k&yacute; của thứ trưởng).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Suốt qu&aacute; tr&igrave;nh x&eacute;t xử, bị c&aacute;o Ki&ecirc;n c&ugrave;ng Vũ Anh Tuấn (cựu ph&oacute; ph&ograve;ng tham mưu, Cục Quản l&yacute; xuất nhập cảnh, Bộ C&ocirc;ng an) l&agrave; hai người bị "nhắc" t&ecirc;n nhiều nhất khi nhiều chủ doanh nghiệp khai bị hai bị c&aacute;o n&agrave;y "l&agrave;m kh&oacute;" trong cấp ph&eacute;p chuyến bay nếu kh&ocirc;ng đưa tiền.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong 19 doanh nghiệp đưa hối lộ c&oacute; 12 c&ocirc;ng ty khai Ki&ecirc;n trực tiếp ra gi&aacute; 150-200 triệu đồng cho mỗi chuyến bay hoặc 1-2 triệu đồng mỗi h&agrave;nh kh&aacute;ch, theo c&aacute;o buộc.</p>
            //                       <figure class="tplCaption action_thumb_added" data-size="true">
            //                       <div class="fig-picture"><picture><source srcset="
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA  1x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA  2x
            //                                                                             " data-srcset="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA 1x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA 2x"> <img class="lazy lazied" src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" alt="Bị c&aacute;o Phạm Trung Ki&ecirc;n. Ảnh: Ngọc Th&agrave;nh" loading="lazy" data-src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" data-ll-status="loaded"></picture></div>
            //                       <figcaption>
            //                       <p class="Image">Bị c&aacute;o Phạm Trung Ki&ecirc;n trong ng&agrave;y đầu ti&ecirc;n của phi&ecirc;n t&ograve;a. Ảnh:&nbsp;<em>Ngọc Th&agrave;nh</em></p>
            //                       </figcaption>
            //                       </figure>
            //                       <p class="Normal" style="line-height: 1.4;">Ki&ecirc;n l&agrave; bị c&aacute;o duy nhất bị VKS&nbsp;<a href="https://vnexpress.net/vks-cuu-thu-ky-thu-truong-y-te-nhan-tien-trang-tron-nhat-4630149.html" rel="dofollow" data-itm-source="#vn_source=Detail-PhapLuat-4634933&amp;vn_campaign=Box-InternalLink&amp;vn_medium=Link-DeNghiAnTuHinh&amp;vn_term=Desktop&amp;vn_thumb=0" data-itm-added="1">đề nghị &aacute;n tử h&igrave;nh&nbsp;</a>với c&aacute;o buộc&nbsp;<em>Nhận hối lộ&nbsp;</em>"c&ocirc;ng khai, trắng trợn nhất", tổng 42,6 tỷ đồng, 253 lần, trong đ&oacute; 228 lần qua chuyển khoản. Ngo&agrave;i 12 tỷ đồng trả cho c&aacute;c doanh nghiệp trong giai đoạn điều tra v&agrave; 23 tỷ đồng đ&atilde; nộp trong giai đoạn x&eacute;t xử, gia đ&igrave;nh &ocirc;ng Ki&ecirc;n đ&atilde; nộp th&ecirc;m 7 tỷ đồng khi HĐXX nghị &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong phần tự b&agrave;o chữa, &ocirc;ng Ki&ecirc;n "nhận lỗi với nh&acirc;n d&acirc;n". Cho rằng mức &aacute;n VKS đề nghị "qu&aacute; nghiệt ng&atilde;", cựu thư k&yacute; thứ trưởng xin được hưởng mức phạt t&ugrave; c&oacute; thời hạn để sớm trở về với gia đ&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nghị quyết 03/2020 của Hội đồng thẩm ph&aacute;n TAND Tối cao đang được &aacute;p dụng, trong qu&aacute; tr&igrave;nh tố tụng, người phạm tội nhận hối lộ đ&atilde; chủ động nộp lại &iacute;t nhất ba phần tư t&agrave;i sản nhận hối lộ th&igrave; kh&ocirc;ng &aacute;p dụng mức cao nhất của khung h&igrave;nh phạt l&agrave; tử h&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>M&acirc;u thuẫn về tiền 'chạy &aacute;n'</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Khi vụ &aacute;n đang bị điều tra, một nh&oacute;m bốn bị c&aacute;o, trong đ&oacute; c&oacute; Ho&agrave;ng Văn Hưng cựu Trưởng ph&ograve;ng 5, Cơ quan An ninh Điều tra, Bộ C&ocirc;ng an v&agrave; cựu Ph&oacute; gi&aacute;m đốc C&ocirc;ng an H&agrave; Nội Nguyễn Anh Tuấn đ&atilde; "bắt tay" để chạy &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">&Ocirc;ng Hưng l&agrave; một trong hai bị c&aacute;o k&ecirc;u oan suốt những ng&agrave;y x&eacute;t xử.</p>
            //                       <p class="Normal" style="line-height: 1.4;">VKS c&aacute;o buộc, kết nối với điều tra vi&ecirc;n ch&iacute;nh của vụ &aacute;n l&agrave; Hưng, &ocirc;ng Tuấn đ&atilde; nhận 2,6 triệu USD để lo cho bị c&aacute;o L&ecirc; Hồng Sơn v&agrave; Nguyễn Thị Thanh Hằng (Tổng gi&aacute;m đốc v&agrave; Ph&oacute; tổng gi&aacute;m đốc C&ocirc;ng ty Bầu Trời Xanh).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nh&agrave; chức tr&aacute;ch, &ocirc;ng Hưng đ&atilde; "đưa th&ocirc;ng tin gian dối" để chiếm đoạt 800.000 USD của bị c&aacute;o Hằng, vậy c&ograve;n 1,8 triệu USD đang ở đ&acirc;u? Suốt phần x&eacute;t hỏi v&agrave; tranh luận, bị c&aacute;o Hưng nhiều lần đề nghị l&agrave;m r&otilde; số tiền "m&acirc;u thuẫn" n&agrave;y.</p>
            //                       <p class="Normal" style="line-height: 1.4;">"T&ocirc;i đề nghị VKS phải chứng minh số tiền 1,8 triệu USD đ&atilde; đi đ&acirc;u về đ&acirc;u, liệu c&oacute; phải &ocirc;ng Tuấn cũng lừa đảo kh&ocirc;ng?", bị c&aacute;o Hưng n&oacute;i v&agrave; đặt dấu hỏi rằng nếu &ocirc;ng Tuấn đ&atilde; nộp lại 1,8 triệu USD th&igrave; "c&oacute; phải cũng phạm tội lừa đảo chiếm đoạt t&agrave;i sản?".</p>
            //                       <p class="Normal" style="line-height: 1.4;">Hiện, &ocirc;ng Tuấn đ&atilde; nộp 1,85 triệu USD để khắc phục hậu quả v&agrave; l&agrave; người nộp lại tiền nhiều nhất trong 54 bị c&aacute;o.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Bị c&aacute;o Hưng bị VKS đề nghị 19-20 năm về tội&nbsp;<em>Lừa đảo chiếm đoạt t&agrave;i sản</em>, &ocirc;ng Tuấn bị đề nghị 5-6 năm về với c&aacute;o buộc&nbsp;<em>M&ocirc;i giới hối lộ&nbsp;</em>2,6 triệu USD, b&agrave; Hằng bị đề nghị 10-11 năm về tội&nbsp;<em>Đưa hối lộ.</em></p>
            //                       </article>
            //                       </div>`,
            //                                                 }
            //                                           );
            //                               } catch (error) {
            //                                     newArticle =
            //                                           await db.new_article.create(
            //                                                 {
            //                                                       ...articel
            //                                                             .article[
            //                                                             i
            //                                                       ],
            //                                                       slug_crc,
            //                                                       avatar: slug_crc,
            //                                                       content: `<div class="title-detail" style="width: 700px; margin: 0px auto;">
            //                       <div class="title-detail" style="width: 700px; margin: 0px auto;">
            //                       <h1 class="title-detail">Những vấn đề chờ t&ograve;a ph&aacute;n quyết trong vụ 'chuyến bay giải cứu'</h1>
            //                       <p class="description" style="line-height: 1.4;"><span class="location-stamp"><span style="color: rgb(126, 140, 141);">H&Agrave; NỘI</span> - </span>Chiếc cặp đựng 450.000 USD tiền chạy &aacute;n hay chỉ 4 chai rượu vang, cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm &aacute;n so với h&igrave;nh phạt đề nghị tử h&igrave;nh... đang chờ t&ograve;a tuy&ecirc;n chiều nay.</p>
            //                       <article class="fck_detail">
            //                       <p class="Normal" style="line-height: 1.4;">Sau 6 ng&agrave;y nghỉ nghị &aacute;n, TAND H&agrave; Nội sẽ ra ph&aacute;n quyết sơ thẩm với 54 bị c&aacute;o trong vụ &aacute;n "chuyến bay giải cứu". Trong 12 ng&agrave;y x&eacute;t xử, hai bị c&aacute;o một mực k&ecirc;u oan l&agrave; Ho&agrave;ng Văn Hưng v&agrave; Trần Minh Tuấn (Gi&aacute;m đốc C&ocirc;ng ty Cổ phần x&acirc;y dựng Th&aacute;i H&ograve;a). Những bị c&aacute;o c&ograve;n lại thừa nhận to&agrave;n bộ hoặc một phần h&agrave;nh vi, mong được hưởng khoan hồng.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Đ&acirc;y l&agrave; vụ &aacute;n đặc biệt nghi&ecirc;m trọng, phức tạp, xảy ra trong bối cảnh Covid-19 b&ugrave;ng ph&aacute;t, c&aacute;c bị c&aacute;o l&agrave; quan chức v&agrave; chủ doanh nghiệp đ&atilde; lợi dụng t&igrave;nh h&igrave;nh dịch bệnh để trục lợi, VKS đ&aacute;nh gi&aacute;.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>Cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm nhẹ h&igrave;nh phạt?</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Bộ Y tế l&agrave; một trong 5 Bộ tham gia tổ c&ocirc;ng t&aacute;c thực hiện đưa c&ocirc;ng d&acirc;n về nước. Tại đ&acirc;y, Cục Y tế dự ph&ograve;ng được giao nhiệm vụ ph&ecirc; duyệt hoặc từ chối đề xuất của Bộ Ngoại giao về tần suất, số lượng chuyến bay giải cứu, ph&ugrave; hợp với t&igrave;nh h&igrave;nh dịch bệnh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo quy tr&igrave;nh, thứ trưởng y tế khi nhận được đề xuất tổ chức chuyến bay giải cứu, combo (người d&acirc;n phải tự nguyện trả ph&iacute; to&agrave;n bộ) hoặc kh&aacute;ch lẻ xin về nước sẽ chuyển cho Cục Y tế dự ph&ograve;ng tham mưu. Mọi trao đổi giữa cục v&agrave; thứ trưởng đều th&ocirc;ng qua Phạm Trung Ki&ecirc;n (thư k&yacute; của thứ trưởng).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Suốt qu&aacute; tr&igrave;nh x&eacute;t xử, bị c&aacute;o Ki&ecirc;n c&ugrave;ng Vũ Anh Tuấn (cựu ph&oacute; ph&ograve;ng tham mưu, Cục Quản l&yacute; xuất nhập cảnh, Bộ C&ocirc;ng an) l&agrave; hai người bị "nhắc" t&ecirc;n nhiều nhất khi nhiều chủ doanh nghiệp khai bị hai bị c&aacute;o n&agrave;y "l&agrave;m kh&oacute;" trong cấp ph&eacute;p chuyến bay nếu kh&ocirc;ng đưa tiền.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong 19 doanh nghiệp đưa hối lộ c&oacute; 12 c&ocirc;ng ty khai Ki&ecirc;n trực tiếp ra gi&aacute; 150-200 triệu đồng cho mỗi chuyến bay hoặc 1-2 triệu đồng mỗi h&agrave;nh kh&aacute;ch, theo c&aacute;o buộc.</p>
            //                       <figure class="tplCaption action_thumb_added" data-size="true">
            //                       <div class="fig-picture"><picture><source srcset="
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA  1x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA  2x
            //                                                                             " data-srcset="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA 1x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA 2x"> <img class="lazy lazied" src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" alt="Bị c&aacute;o Phạm Trung Ki&ecirc;n. Ảnh: Ngọc Th&agrave;nh" loading="lazy" data-src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" data-ll-status="loaded"></picture></div>
            //                       <figcaption>
            //                       <p class="Image">Bị c&aacute;o Phạm Trung Ki&ecirc;n trong ng&agrave;y đầu ti&ecirc;n của phi&ecirc;n t&ograve;a. Ảnh:&nbsp;<em>Ngọc Th&agrave;nh</em></p>
            //                       </figcaption>
            //                       </figure>
            //                       <p class="Normal" style="line-height: 1.4;">Ki&ecirc;n l&agrave; bị c&aacute;o duy nhất bị VKS&nbsp;<a href="https://vnexpress.net/vks-cuu-thu-ky-thu-truong-y-te-nhan-tien-trang-tron-nhat-4630149.html" rel="dofollow" data-itm-source="#vn_source=Detail-PhapLuat-4634933&amp;vn_campaign=Box-InternalLink&amp;vn_medium=Link-DeNghiAnTuHinh&amp;vn_term=Desktop&amp;vn_thumb=0" data-itm-added="1">đề nghị &aacute;n tử h&igrave;nh&nbsp;</a>với c&aacute;o buộc&nbsp;<em>Nhận hối lộ&nbsp;</em>"c&ocirc;ng khai, trắng trợn nhất", tổng 42,6 tỷ đồng, 253 lần, trong đ&oacute; 228 lần qua chuyển khoản. Ngo&agrave;i 12 tỷ đồng trả cho c&aacute;c doanh nghiệp trong giai đoạn điều tra v&agrave; 23 tỷ đồng đ&atilde; nộp trong giai đoạn x&eacute;t xử, gia đ&igrave;nh &ocirc;ng Ki&ecirc;n đ&atilde; nộp th&ecirc;m 7 tỷ đồng khi HĐXX nghị &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong phần tự b&agrave;o chữa, &ocirc;ng Ki&ecirc;n "nhận lỗi với nh&acirc;n d&acirc;n". Cho rằng mức &aacute;n VKS đề nghị "qu&aacute; nghiệt ng&atilde;", cựu thư k&yacute; thứ trưởng xin được hưởng mức phạt t&ugrave; c&oacute; thời hạn để sớm trở về với gia đ&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nghị quyết 03/2020 của Hội đồng thẩm ph&aacute;n TAND Tối cao đang được &aacute;p dụng, trong qu&aacute; tr&igrave;nh tố tụng, người phạm tội nhận hối lộ đ&atilde; chủ động nộp lại &iacute;t nhất ba phần tư t&agrave;i sản nhận hối lộ th&igrave; kh&ocirc;ng &aacute;p dụng mức cao nhất của khung h&igrave;nh phạt l&agrave; tử h&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>M&acirc;u thuẫn về tiền 'chạy &aacute;n'</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Khi vụ &aacute;n đang bị điều tra, một nh&oacute;m bốn bị c&aacute;o, trong đ&oacute; c&oacute; Ho&agrave;ng Văn Hưng cựu Trưởng ph&ograve;ng 5, Cơ quan An ninh Điều tra, Bộ C&ocirc;ng an v&agrave; cựu Ph&oacute; gi&aacute;m đốc C&ocirc;ng an H&agrave; Nội Nguyễn Anh Tuấn đ&atilde; "bắt tay" để chạy &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">&Ocirc;ng Hưng l&agrave; một trong hai bị c&aacute;o k&ecirc;u oan suốt những ng&agrave;y x&eacute;t xử.</p>
            //                       <p class="Normal" style="line-height: 1.4;">VKS c&aacute;o buộc, kết nối với điều tra vi&ecirc;n ch&iacute;nh của vụ &aacute;n l&agrave; Hưng, &ocirc;ng Tuấn đ&atilde; nhận 2,6 triệu USD để lo cho bị c&aacute;o L&ecirc; Hồng Sơn v&agrave; Nguyễn Thị Thanh Hằng (Tổng gi&aacute;m đốc v&agrave; Ph&oacute; tổng gi&aacute;m đốc C&ocirc;ng ty Bầu Trời Xanh).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nh&agrave; chức tr&aacute;ch, &ocirc;ng Hưng đ&atilde; "đưa th&ocirc;ng tin gian dối" để chiếm đoạt 800.000 USD của bị c&aacute;o Hằng, vậy c&ograve;n 1,8 triệu USD đang ở đ&acirc;u? Suốt phần x&eacute;t hỏi v&agrave; tranh luận, bị c&aacute;o Hưng nhiều lần đề nghị l&agrave;m r&otilde; số tiền "m&acirc;u thuẫn" n&agrave;y.</p>
            //                       <p class="Normal" style="line-height: 1.4;">"T&ocirc;i đề nghị VKS phải chứng minh số tiền 1,8 triệu USD đ&atilde; đi đ&acirc;u về đ&acirc;u, liệu c&oacute; phải &ocirc;ng Tuấn cũng lừa đảo kh&ocirc;ng?", bị c&aacute;o Hưng n&oacute;i v&agrave; đặt dấu hỏi rằng nếu &ocirc;ng Tuấn đ&atilde; nộp lại 1,8 triệu USD th&igrave; "c&oacute; phải cũng phạm tội lừa đảo chiếm đoạt t&agrave;i sản?".</p>
            //                       <p class="Normal" style="line-height: 1.4;">Hiện, &ocirc;ng Tuấn đ&atilde; nộp 1,85 triệu USD để khắc phục hậu quả v&agrave; l&agrave; người nộp lại tiền nhiều nhất trong 54 bị c&aacute;o.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Bị c&aacute;o Hưng bị VKS đề nghị 19-20 năm về tội&nbsp;<em>Lừa đảo chiếm đoạt t&agrave;i sản</em>, &ocirc;ng Tuấn bị đề nghị 5-6 năm về với c&aacute;o buộc&nbsp;<em>M&ocirc;i giới hối lộ&nbsp;</em>2,6 triệu USD, b&agrave; Hằng bị đề nghị 10-11 năm về tội&nbsp;<em>Đưa hối lộ.</em></p>
            //                       </article>
            //                       </div>
            //                       <h1 class="title-detail">Những vấn đề chờ t&ograve;a ph&aacute;n quyết trong vụ 'chuyến bay giải cứu'</h1>
            //                       <p class="description" style="line-height: 1.4;"><span class="location-stamp">H&Agrave; NỘI</span>Chiếc cặp đựng 450.000 USD tiền chạy &aacute;n hay chỉ 4 chai rượu vang, cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm &aacute;n so với h&igrave;nh phạt đề nghị tử h&igrave;nh... đang chờ t&ograve;a tuy&ecirc;n chiều nay.</p>
            //                       <article class="fck_detail">
            //                       <p class="Normal" style="line-height: 1.4;">Sau 6 ng&agrave;y nghỉ nghị &aacute;n, TAND H&agrave; Nội sẽ ra ph&aacute;n quyết sơ thẩm với 54 bị c&aacute;o trong vụ &aacute;n "chuyến bay giải cứu". Trong 12 ng&agrave;y x&eacute;t xử, hai bị c&aacute;o một mực k&ecirc;u oan l&agrave; Ho&agrave;ng Văn Hưng v&agrave; Trần Minh Tuấn (Gi&aacute;m đốc C&ocirc;ng ty Cổ phần x&acirc;y dựng Th&aacute;i H&ograve;a). Những bị c&aacute;o c&ograve;n lại thừa nhận to&agrave;n bộ hoặc một phần h&agrave;nh vi, mong được hưởng khoan hồng.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Đ&acirc;y l&agrave; vụ &aacute;n đặc biệt nghi&ecirc;m trọng, phức tạp, xảy ra trong bối cảnh Covid-19 b&ugrave;ng ph&aacute;t, c&aacute;c bị c&aacute;o l&agrave; quan chức v&agrave; chủ doanh nghiệp đ&atilde; lợi dụng t&igrave;nh h&igrave;nh dịch bệnh để trục lợi, VKS đ&aacute;nh gi&aacute;.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>Cựu thư k&yacute; thứ trưởng Y tế c&oacute; được giảm nhẹ h&igrave;nh phạt?</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Bộ Y tế l&agrave; một trong 5 Bộ tham gia tổ c&ocirc;ng t&aacute;c thực hiện đưa c&ocirc;ng d&acirc;n về nước. Tại đ&acirc;y, Cục Y tế dự ph&ograve;ng được giao nhiệm vụ ph&ecirc; duyệt hoặc từ chối đề xuất của Bộ Ngoại giao về tần suất, số lượng chuyến bay giải cứu, ph&ugrave; hợp với t&igrave;nh h&igrave;nh dịch bệnh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo quy tr&igrave;nh, thứ trưởng y tế khi nhận được đề xuất tổ chức chuyến bay giải cứu, combo (người d&acirc;n phải tự nguyện trả ph&iacute; to&agrave;n bộ) hoặc kh&aacute;ch lẻ xin về nước sẽ chuyển cho Cục Y tế dự ph&ograve;ng tham mưu. Mọi trao đổi giữa cục v&agrave; thứ trưởng đều th&ocirc;ng qua Phạm Trung Ki&ecirc;n (thư k&yacute; của thứ trưởng).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Suốt qu&aacute; tr&igrave;nh x&eacute;t xử, bị c&aacute;o Ki&ecirc;n c&ugrave;ng Vũ Anh Tuấn (cựu ph&oacute; ph&ograve;ng tham mưu, Cục Quản l&yacute; xuất nhập cảnh, Bộ C&ocirc;ng an) l&agrave; hai người bị "nhắc" t&ecirc;n nhiều nhất khi nhiều chủ doanh nghiệp khai bị hai bị c&aacute;o n&agrave;y "l&agrave;m kh&oacute;" trong cấp ph&eacute;p chuyến bay nếu kh&ocirc;ng đưa tiền.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong 19 doanh nghiệp đưa hối lộ c&oacute; 12 c&ocirc;ng ty khai Ki&ecirc;n trực tiếp ra gi&aacute; 150-200 triệu đồng cho mỗi chuyến bay hoặc 1-2 triệu đồng mỗi h&agrave;nh kh&aacute;ch, theo c&aacute;o buộc.</p>
            //                       <figure class="tplCaption action_thumb_added" data-size="true">
            //                       <div class="fig-picture"><picture><source srcset="
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA  1x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x,
            //                                                                                   https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA  2x
            //                                                                             " data-srcset="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA 1x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=O7mq45AiWnTr6AaseimabQ 1.5x, https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=d-pMIFUAdMxoVTDOwGvAzA 2x"> <img class="lazy lazied" src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" alt="Bị c&aacute;o Phạm Trung Ki&ecirc;n. Ảnh: Ngọc Th&agrave;nh" loading="lazy" data-src="https://i1-vnexpress.vnecdn.net/2023/07/28/21-Kie-n-jpeg-1546-1690506940.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=OSjUuYOXNkg2TjjVppzSBA" data-ll-status="loaded"></picture></div>
            //                       <figcaption>
            //                       <p class="Image">Bị c&aacute;o Phạm Trung Ki&ecirc;n trong ng&agrave;y đầu ti&ecirc;n của phi&ecirc;n t&ograve;a. Ảnh:&nbsp;<em>Ngọc Th&agrave;nh</em></p>
            //                       </figcaption>
            //                       </figure>
            //                       <p class="Normal" style="line-height: 1.4;">Ki&ecirc;n l&agrave; bị c&aacute;o duy nhất bị VKS&nbsp;<a href="https://vnexpress.net/vks-cuu-thu-ky-thu-truong-y-te-nhan-tien-trang-tron-nhat-4630149.html" rel="dofollow" data-itm-source="#vn_source=Detail-PhapLuat-4634933&amp;vn_campaign=Box-InternalLink&amp;vn_medium=Link-DeNghiAnTuHinh&amp;vn_term=Desktop&amp;vn_thumb=0" data-itm-added="1">đề nghị &aacute;n tử h&igrave;nh&nbsp;</a>với c&aacute;o buộc&nbsp;<em>Nhận hối lộ&nbsp;</em>"c&ocirc;ng khai, trắng trợn nhất", tổng 42,6 tỷ đồng, 253 lần, trong đ&oacute; 228 lần qua chuyển khoản. Ngo&agrave;i 12 tỷ đồng trả cho c&aacute;c doanh nghiệp trong giai đoạn điều tra v&agrave; 23 tỷ đồng đ&atilde; nộp trong giai đoạn x&eacute;t xử, gia đ&igrave;nh &ocirc;ng Ki&ecirc;n đ&atilde; nộp th&ecirc;m 7 tỷ đồng khi HĐXX nghị &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Trong phần tự b&agrave;o chữa, &ocirc;ng Ki&ecirc;n "nhận lỗi với nh&acirc;n d&acirc;n". Cho rằng mức &aacute;n VKS đề nghị "qu&aacute; nghiệt ng&atilde;", cựu thư k&yacute; thứ trưởng xin được hưởng mức phạt t&ugrave; c&oacute; thời hạn để sớm trở về với gia đ&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nghị quyết 03/2020 của Hội đồng thẩm ph&aacute;n TAND Tối cao đang được &aacute;p dụng, trong qu&aacute; tr&igrave;nh tố tụng, người phạm tội nhận hối lộ đ&atilde; chủ động nộp lại &iacute;t nhất ba phần tư t&agrave;i sản nhận hối lộ th&igrave; kh&ocirc;ng &aacute;p dụng mức cao nhất của khung h&igrave;nh phạt l&agrave; tử h&igrave;nh.</p>
            //                       <p class="Normal" style="line-height: 1.4;"><strong>M&acirc;u thuẫn về tiền 'chạy &aacute;n'</strong></p>
            //                       <p class="Normal" style="line-height: 1.4;">Khi vụ &aacute;n đang bị điều tra, một nh&oacute;m bốn bị c&aacute;o, trong đ&oacute; c&oacute; Ho&agrave;ng Văn Hưng cựu Trưởng ph&ograve;ng 5, Cơ quan An ninh Điều tra, Bộ C&ocirc;ng an v&agrave; cựu Ph&oacute; gi&aacute;m đốc C&ocirc;ng an H&agrave; Nội Nguyễn Anh Tuấn đ&atilde; "bắt tay" để chạy &aacute;n.</p>
            //                       <p class="Normal" style="line-height: 1.4;">&Ocirc;ng Hưng l&agrave; một trong hai bị c&aacute;o k&ecirc;u oan suốt những ng&agrave;y x&eacute;t xử.</p>
            //                       <p class="Normal" style="line-height: 1.4;">VKS c&aacute;o buộc, kết nối với điều tra vi&ecirc;n ch&iacute;nh của vụ &aacute;n l&agrave; Hưng, &ocirc;ng Tuấn đ&atilde; nhận 2,6 triệu USD để lo cho bị c&aacute;o L&ecirc; Hồng Sơn v&agrave; Nguyễn Thị Thanh Hằng (Tổng gi&aacute;m đốc v&agrave; Ph&oacute; tổng gi&aacute;m đốc C&ocirc;ng ty Bầu Trời Xanh).</p>
            //                       <p class="Normal" style="line-height: 1.4;">Theo nh&agrave; chức tr&aacute;ch, &ocirc;ng Hưng đ&atilde; "đưa th&ocirc;ng tin gian dối" để chiếm đoạt 800.000 USD của bị c&aacute;o Hằng, vậy c&ograve;n 1,8 triệu USD đang ở đ&acirc;u? Suốt phần x&eacute;t hỏi v&agrave; tranh luận, bị c&aacute;o Hưng nhiều lần đề nghị l&agrave;m r&otilde; số tiền "m&acirc;u thuẫn" n&agrave;y.</p>
            //                       <p class="Normal" style="line-height: 1.4;">"T&ocirc;i đề nghị VKS phải chứng minh số tiền 1,8 triệu USD đ&atilde; đi đ&acirc;u về đ&acirc;u, liệu c&oacute; phải &ocirc;ng Tuấn cũng lừa đảo kh&ocirc;ng?", bị c&aacute;o Hưng n&oacute;i v&agrave; đặt dấu hỏi rằng nếu &ocirc;ng Tuấn đ&atilde; nộp lại 1,8 triệu USD th&igrave; "c&oacute; phải cũng phạm tội lừa đảo chiếm đoạt t&agrave;i sản?".</p>
            //                       <p class="Normal" style="line-height: 1.4;">Hiện, &ocirc;ng Tuấn đ&atilde; nộp 1,85 triệu USD để khắc phục hậu quả v&agrave; l&agrave; người nộp lại tiền nhiều nhất trong 54 bị c&aacute;o.</p>
            //                       <p class="Normal" style="line-height: 1.4;">Bị c&aacute;o Hưng bị VKS đề nghị 19-20 năm về tội&nbsp;<em>Lừa đảo chiếm đoạt t&agrave;i sản</em>, &ocirc;ng Tuấn bị đề nghị 5-6 năm về với c&aacute;o buộc&nbsp;<em>M&ocirc;i giới hối lộ&nbsp;</em>2,6 triệu USD, b&agrave; Hằng bị đề nghị 10-11 năm về tội&nbsp;<em>Đưa hối lộ.</em></p>
            //                       </article>
            //                       </div>`,
            //                                                 }
            //                                           );
            //                                     continue;
            //                               }
            //                               if (i < 9) {
            //                                     await db.new_articles_category.create(
            //                                           {
            //                                                 category_id:
            //                                                       subCate.id,
            //                                                 article_id:
            //                                                       newArticle.id,
            //                                           }
            //                                     );
            //                                     await db.new_articles_hot_category.create(
            //                                           {
            //                                                 category_id:
            //                                                       subCate.id,
            //                                                 article_id:
            //                                                       newArticle.id,
            //                                                 position: i + 1,
            //                                           }
            //                                     );
            //                               } else if (
            //                                     subCate.childCategories
            //                                           .length >=
            //                                     Math.floor(i / 9)
            //                               ) {
            //                                     console.log((i % 9) + 1);
            //                                     await db.new_articles_category.create(
            //                                           {
            //                                                 category_id:
            //                                                       subCate
            //                                                             .childCategories[
            //                                                             Math.floor(
            //                                                                   i /
            //                                                                         9
            //                                                             ) - 1
            //                                                       ].id,
            //                                                 article_id:
            //                                                       newArticle.id,
            //                                           }
            //                                     );
            //                                     await db.new_articles_category.create(
            //                                           {
            //                                                 category_id:
            //                                                       subCate.id,

            //                                                 article_id:
            //                                                       newArticle.id,
            //                                           }
            //                                     );
            //                                     await db.new_articles_hot_category.create(
            //                                           {
            //                                                 category_id:
            //                                                       subCate
            //                                                             .childCategories[
            //                                                             Math.floor(
            //                                                                   i /
            //                                                                         9
            //                                                             ) - 1
            //                                                       ].id,
            //                                                 article_id:
            //                                                       newArticle.id,
            //                                                 position:
            //                                                       (i % 9) + 1,
            //                                           }
            //                                     );
            //                               }
            //                         }
            //                   }

            //                   return { message: "okkkk" };
            //             } catch (error) {
            //                   console.log(error);
            //             }
            //       },
            // },
            delete: {
                  deleteArticleService: async (id) => {
                        const listID = JSON.parse(id);
                        try {
                              const articles = await db.new_article.findAll({
                                    where: {
                                          id: {
                                                [Op.in]: listID,
                                          },
                                    },
                                    attributes: ["avatar"],
                              });

                              await db.new_articles_hot_main.destroy({
                                    where: {
                                          article_id: {
                                                [Op.in]: listID,
                                          },
                                    },
                              });
                              await db.new_articles_hot_category.destroy({
                                    where: {
                                          article_id: {
                                                [Op.in]: listID,
                                          },
                                    },
                              });
                              await db.new_articles_category.destroy({
                                    where: {
                                          article_id: {
                                                [Op.in]: listID,
                                          },
                                    },
                              });
                              await db.new_article.destroy({
                                    where: {
                                          id: {
                                                [Op.in]: listID,
                                          },
                                    },
                              });
                              articles.map((article) => {
                                    fs.unlink(
                                          "src/uploadFile/avatars/" +
                                                article.avatar +
                                                ".png",
                                          (err) => {
                                                if (err) {
                                                } else {
                                                      console.log(
                                                            "Tệp tin đã được xóa thành công."
                                                      );
                                                }
                                          }
                                    );
                              });

                              return {
                                    message: "Xóa bài viết thành công",
                                    status: 1,
                              };
                        } catch (error) {
                              return {
                                    message: "Xóa bài viết không thành công",
                                    status: 0,
                              };
                        }
                  },
                  deleteHotMainService: async (data) => {
                        try {
                              await db.new_articles_hot_main.destroy({
                                    where: {
                                          article_id: data.id,
                                          position: data.position,
                                    },
                              });
                              return {
                                    message: "Xóa vị trị nổi bật của bài viết thành công",
                              };
                        } catch (error) {
                              console.log(error);
                        }
                  },
                  deleteHotCateService: async (data) => {
                        try {
                              await db.new_articles_hot_category.destroy({
                                    where: {
                                          ...data,
                                    },
                              });
                              return {
                                    message: "Xóa vị trị nổi bật của bài viết thành công",
                              };
                        } catch (error) {
                              console.log(error);
                        }
                  },
            },
      },
};

module.exports = articlesService;
