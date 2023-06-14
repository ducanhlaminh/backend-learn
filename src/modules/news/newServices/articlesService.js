const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const articlesService = {
    get: {
        getHotService: async (req, res) => {
            try {
                const hot_main = await db.new_articles_hot_main.findAll({
                    order: [["position", "ASC"]],
                    attributes: ["article_id", "position"],
                    include: [
                        {
                            model: db.new_article,
                            attributes: [
                                "avatar",
                                "title",
                                "sapo",
                                "slug",
                                "slug_crc",
                            ],
                        },
                    ],
                });
                const hot_categories = await db.new_category.findAll({
                    where: {
                        parent_id: null,
                    },
                    attributes: ["name", "slug", "slug_crc"],
                    include: [
                        {
                            model: db.new_articles_hot_category,
                            attributes: ["article_id", "position"],

                            order: [["position", "ASC"]],
                            include: [
                                {
                                    model: db.new_article,
                                    attributes: ["avatar", "title"],
                                },
                            ],
                        },
                    ],
                });
                return {
                    hot_main,
                    hot_categories,
                };
            } catch (error) {
                return error;
            }
        },
        getByTitleService: async (title) => {
            try {
                const articles = await db.new_article.findAndCountAll({
                    attributes: [
                        "title",
                        "slug",
                        "avatar",
                        "sapo",
                        "publishAt",
                    ],
                    where: {
                        title: {
                            [Op.like]: `%${title}%`,
                        },
                    },
                    limit: 15,
                    order: [["publishAt", "DESC"]],
                });
                return {
                    data: articles,
                    status: 0,
                };
            } catch (error) {
                return error;
            }
        },
        getByCateService: async (slug, slug_crc) => {
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
                        const articles_category = await db.new_category.findOne(
                            {
                                where: [
                                    {
                                        slug,
                                    },
                                ],
                                attributes: [
                                    "id",
                                    "slug",
                                    "slug_crc",
                                    "parent_id",
                                    "name",
                                ],
                            }
                        );
                        const list_article_new =
                            await db.new_articles_category.findAll({
                                where: {
                                    [Op.or]: {
                                        category_id: articles_category.id,
                                    },
                                },
                                include: [
                                    {
                                        model: db.new_article,
                                        required: true,
                                    },
                                ],
                                order: [[db.new_article, "publishAt", "DESC"]],
                            });
                        return {
                            articles_category,
                            list_article_new,
                            status: 0,
                        };
                    }
                } else {
                    return {
                        message: "Khong tim thay danh muc",
                    };
                }
            } catch (error) {
                return error;
            }
        },
        getByMostView: async (slug_crc) => {
            var list_article_most_views;
            if (slug_crc) {
                const idCate = await db.new_category.findOne({
                    where: [{ slug_crc }],
                    attributes: ["id", "slug", "slug_crc", "parent_id", "name"],
                });
                if (idCate) {
                    list_article_most_views =
                        await db.new_articles_category.findAll({
                            where: {
                                category_id: idCate.id,
                            },
                            limit: 5,
                            include: [
                                {
                                    model: db.new_article,
                                    required: true,
                                    attributes: [
                                        "avatar",
                                        "slug",
                                        "slug_crc",
                                        "title",
                                        "views",
                                    ],
                                    include: [
                                        {
                                            model: db.new_articles_category,
                                            attributes: ["category_id"],
                                            include: [
                                                {
                                                    model: db.new_category,
                                                    attributes: [
                                                        "name",
                                                        "slug",
                                                        "slug_crc",
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                            order: [[db.new_article, "views", "DESC"]],
                        });
                }
            } else {
                list_article_most_views = await db.new_article.findAll({
                    // where: [
                    //         {
                    //                 status: 1,
                    //         },
                    // ],
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
                            attributes: ["category_id"],
                            include: [
                                {
                                    model: db.new_category,
                                    attributes: ["name", "slug", "slug_crc"],
                                },
                            ],
                        },
                    ],
                });
            }
            return list_article_most_views;
        },
        getByPublishAt: async (slug_crc) => {
            let list_article_new;
            if (!slug_crc) {
                const idBook = await db.new_category.findOne({
                    where: [
                        {
                            slug: "Xuất bản",
                        },
                    ],
                    attributes: ["id", "slug", "slug_crc", "parent_id", "name"],
                });
                list_article_new = await db.new_articles_category.findAll({
                    // where: {
                    //         [Op.not]:
                    //                 {
                    //                         category_id:
                    //                                 idBook?.id,
                    //                 },
                    // },
                    include: [
                        {
                            model: db.new_article,
                            required: true,
                        },
                    ],
                    order: [[db.new_article, "publishAt", "DESC"]],
                    limit: 20,
                });
            } else {
                const idCate = await db.new_category.findOne({
                    where: [{ slug_crc }],
                    attributes: ["id", "slug", "slug_crc", "parent_id", "name"],
                });
                if (idCate) {
                    list_article_new = await db.new_articles_category.findAll({
                        where: {
                            category_id: idCate.id,
                        },
                        include: [
                            {
                                model: db.new_article,
                                required: true,
                            },
                        ],
                        order: [[db.new_article, "publishAt", "DESC"]],
                    });
                }
            }

            return list_article_new;
        },
        getHotCategoryService: async (slug_crc) => {
            const res = await db.new_category.findOne({
                where: {
                    slug_crc,
                },
                attributes: ["name", "slug", "slug_crc"],
                include: [
                    {
                        model: db.new_articles_hot_category,
                        attributes: ["article_id", "position"],
                        order: [["position", "ASC"]],
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
            return res;
        },
        getHotBoxSubCategoryService: async (slug_crc) => {
            const res = await db.new_category.findOne({
                where: {
                    slug_crc,
                },
                attributes: ["name", "slug", "slug_crc", "id"],
            });
            if (res) {
                const child = await db.new_category.findAll({
                    where: {
                        parent_id: res.id,
                    },
                    attributes: ["name", "slug", "slug_crc", "id"],
                    include: [
                        {
                            model: db.new_articles_hot_category,
                            attributes: ["article_id", "position"],
                            order: [["position", "ASC"]],
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
                return child;
            }
            return;
        },
        getDetailService: async (slug, slug_crc) => {
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
                            where: [
                                {
                                    id: article.id,
                                },
                            ],
                        }
                    );
                    const res = await db.new_articles_category.findOne({
                        where: [
                            {
                                article_id: article.id || 0,
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
                    const articlesCate = await db.new_category.findAll({
                        attributes: ["name", "id", "slug"],
                        where: [
                            {
                                parent_id: null,
                            },
                        ],
                        include: [
                            {
                                model: db.new_category,

                                attributes: ["name", "id", "slug"],
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
                            {
                                model: db.new_articles_category,
                                attributes: ["article_id", "category_id"],
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

                    return {
                        article,
                        articlesCate,
                        cateChild,
                    };
                } else {
                    return {
                        message: "Khong tim thay bai viet",
                    };
                }
            } else {
                return { message: "Khong tim thay bai viet" };
            }
        },
    },
    update: {
        updateHotMain: async (data, id) => {
            const response = await db.new_articles_hot_main.update(
                {
                    position: data.position,
                },
                { where: { article_id: id } }
            );
            if (response !== null) {
                return {
                    message: "Cập nhật vị trí thành công",
                };
            }

            return {
                message: "Cập nhật vị trí không thành công",
            };
        },
        publishService: async (article_id) => {
            try {
                const now = new Date();
                const infor_article = await db.new_article.update(
                    {
                        publishAt: now,
                        status: 1,
                    },
                    {
                        where: {
                            id: article_id,
                        },
                    }
                );
                return {
                    message: "Xuat ban thanh cong",
                    infor_article,
                    status: 0,
                };
            } catch (error) {
                return error;
            }
        },
    },
    create: {
        createHotMain: async (data) => {
            const check = await db.new_articles_hot_main.findOne({
                where: { article_id: data.article_id },
            });
            if (!check) {
                // check position invalid
                if (data.position < 1) {
                    return {
                        message: "Vi tri khong hop le",
                    };
                }
                // Check tại vị trí đó còn trống không
                const checkPosition = await db.new_articles_hot_main.findOne({
                    where: {
                        position: data.position,
                    },
                });
                if (checkPosition === null) {
                    const response = await db.new_articles_hot_main.create({
                        ...data,
                    });
                    return response;
                    return {
                        message: "Bàn viết này đã được set trong tin nổi bật",
                    };
                } else {
                    return {
                        message: "Set vị trí nổi bật không thành công",
                    };
                }
            } else {
                return {
                    message: "Bài viết chưa được xuất bản",
                };
            }
        },
        createHotCate: async (data) => {
            const checkArticle = await db.new_article.findOne({
                where: [
                    {
                        id: data.article_id,
                    },
                ],
            });
            if (checkArticle) {
                const res = await db.new_articles_hot_category.findOne({
                    where: {
                        article_id: data.article_id,
                    },
                });
                if (res === null) {
                    const categoryNew = await db.new_articles_category.findOne({
                        where: {
                            article_id: data.article_id,
                        },
                    });
                    const response = await db.new_articles_hot_category.create({
                        ...data,
                        category_id: categoryNew.category_id,
                    });
                    return response;
                }
                return {
                    message: "Bàn viết này đã được set trong tin nổi bật",
                };
            } else {
                return { message: "Failed to create" };
            }
        },
        createArticleService: async (data) => {
            const slug_crc = crc32(data.slug);
            try {
                // Check article some title or some slug_crc
                const check = await db.new_article.findOne({
                    where: {
                        [Op.or]: {
                            title: data.title,
                            slug_crc: slug_crc,
                        },
                    },
                });
                if (check) {
                    return {
                        status: 0,
                        message: "Đã tồn tại bài viết với title này ",
                    };
                } else {
                    const newArticle = await db.new_article.create({
                        ...data,
                        slug_crc,
                    });
                    const response = await db.new_category.findOne({
                        where: {
                            [Op.or]: {
                                id: data.category_id,
                                parent_id: data.category_id,
                            },
                        },
                        attributes: ["name", "id", "slug", "parent_id"],
                    });
                    const res = await db.new_articles_category.create({
                        category_id: data.category_id,
                        article_id: newArticle.id,
                    });

                    if (response.parent_id) {
                        const parent = await db.new_articles_category.create({
                            category_id: response.parent_id,
                            article_id: newArticle.id,
                        });
                    }

                    return {
                        status: 0,
                        message: "Đã thêm bài viết thành công",
                        newArticle,
                    };
                }
            } catch (error) {
                return error;
            }
        },
    },
    insert: {
        insertDataService: async (data) => {
            for (let articels of data) {
                const subCate = await db.new_category.findOne({
                    where: {
                        slug: articels.slug,
                    },
                    attributes: ["slug", "id"],
                    include: [
                        {
                            model: db.new_category,
                            attributes: ["slug", "id"],
                        },
                    ],
                });
                for (let i = 0; i < articels.article.length; i++) {
                    const slug_crc = crc32(articels.article[i].slug);
                    const newArticle = await db.new_article.create({
                        ...articels.article[i],
                        slug_crc,
                    });
                    if (i < 9) {
                        const res = await db.new_articles_category.create({
                            category_id: subCate.id,

                            article_id: newArticle.id,
                        });
                    } else if (
                        subCate.new_categories.length >= Math.floor(i / 9)
                    ) {
                        const res = await db.new_articles_category.create({
                            category_id:
                                subCate.new_categories[Math.floor(i / 9) - 1]
                                    .id,
                            article_id: newArticle.id,
                        });

                        const parent = await db.new_articles_category.create({
                            category_id: subCate.id,

                            article_id: newArticle.id,
                        });
                    }
                }
            }
            return { message: "okkkk" };
        },
        pushlishedAllService: async () => {
            const articels = await db.new_article.findAll({
                attributes: ["id"],
            });
            let position = 1;
            let categoryNew;
            let lengthCate = await db.new_category.findAll();
            for (let article of articels) {
                if (lengthCate === 0) {
                    break;
                }
                lengthCate--;
                if (position > 9) {
                    position = 1;
                }
                if (position === 1) {
                    categoryNew = await db.new_articles_category.findOne({
                        where: {
                            article_id: article.id,
                        },
                    });
                }
                const now = new Date();
                const infor_article = await db.new_article.update(
                    {
                        publishAt: now,
                        status: 1,
                    },
                    {
                        where: {
                            id: article.id,
                        },
                    }
                );

                const response = await db.new_articles_hot_category.create({
                    article_id: article.id,
                    position,
                    category_id: categoryNew.category_id,
                });
                position = position + 1;
            }
        },
    },
};

module.exports = articlesService;
