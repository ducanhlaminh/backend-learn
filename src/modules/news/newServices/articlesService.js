const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const fs = require("fs");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const articlesService = {
        get: {
                getHotService: asyncHandler(async (req, res) => {
                        try {
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

                                // hot_main.map((item) => {
                                //         if (
                                //                 fs.existsSync(
                                //                         `src/uploadFile/avatars/${
                                //                                 item.new_article
                                //                                         .avatar +
                                //                                 ".png"
                                //                         }`
                                //                 )
                                //         ) {
                                //                 // Tạo URL từ đường dẫn tới hình ảnh
                                //                 const imageUrl = `http://localhost:4000/${item.new_article.avatar}.png`;
                                //                 item.new_article.avatar =
                                //                         imageUrl;
                                //         } else {
                                //         }
                                // });
                                return {
                                        hot_main,
                                };
                        } catch (error) {
                                return error;
                        }
                }),
                getByTitleService: asyncHandler(
                        async ({ title, category_id, page }) => {
                                console.log(title, category_id, page);
                                try {
                                        let queries = {};
                                        (queries.limit = +process.env.LIMIT),
                                                (queries.offset =
                                                        (page - 1) *
                                                        +process.env.LIMIT);
                                        if (category_id) {
                                                console.log(title);
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
                                                                                        status: 1,
                                                                                },
                                                                        },
                                                                        limit: 10,
                                                                }
                                                        );
                                                return articles;
                                        } else {
                                                const articles =
                                                        await db.new_article.findAndCountAll(
                                                                {
                                                                        where: {
                                                                                title: {
                                                                                        [Op.like]: `%${title}%`,
                                                                                },
                                                                                status: 1,
                                                                        },
                                                                        ...queries,
                                                                        order: [
                                                                                [
                                                                                        "publishAt",
                                                                                        "DESC",
                                                                                ],
                                                                        ],
                                                                }
                                                        );
                                                // articles.rows.map((item) => {
                                                //         if (
                                                //                 fs.existsSync(
                                                //                         `src/uploadFile/avatars/${
                                                //                                 item.avatar +
                                                //                                 ".png"
                                                //                         }`
                                                //                 )
                                                //         ) {
                                                //                 // Tạo URL từ đường dẫn tới hình ảnh
                                                //                 const imageUrl = `http://localhost:4000/${item.avatar}.png`;
                                                //                 item.avatar = imageUrl;
                                                //         } else {
                                                //         }
                                                // });
                                                return {
                                                        data: articles,
                                                        status: 0,
                                                };
                                        }
                                } catch (error) {
                                        return error;
                                }
                        }
                ),
                getByCateService: asyncHandler(async (slug, slug_crc) => {
                        try {
                                const checkcrc = await db.new_category.findOne({
                                        where: [{ slug_crc }],
                                });
                                if (checkcrc) {
                                        const checkSlug =
                                                await db.new_category.findOne({
                                                        where: [
                                                                {
                                                                        slug,
                                                                },
                                                        ],
                                                });
                                        if (checkSlug) {
                                                const articles_category =
                                                        await db.new_category.findOne(
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
                                                        await db.new_articles_category.findAll(
                                                                {
                                                                        where: {
                                                                                [Op.or]:
                                                                                        {
                                                                                                category_id:
                                                                                                        articles_category.id,
                                                                                        },
                                                                        },
                                                                        include: [
                                                                                {
                                                                                        model: db.new_article,
                                                                                        required: true,
                                                                                        where: {
                                                                                                status: 1,
                                                                                        },
                                                                                },
                                                                        ],
                                                                        order: [
                                                                                [
                                                                                        {
                                                                                                model: db.new_article,
                                                                                        },
                                                                                        "publishAt",
                                                                                        "DESC",
                                                                                ],
                                                                        ],
                                                                }
                                                        );
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
                }),
                getByMostView: asyncHandler(async (slug_crc) => {
                        var list_article_most_views;
                        try {
                                if (slug_crc) {
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
                                                list_article_most_views =
                                                        await db.new_articles_category.findAll(
                                                                {
                                                                        where: {
                                                                                category_id:
                                                                                        idCate.id,
                                                                        },
                                                                        limit: 5,
                                                                        include: [
                                                                                {
                                                                                        model: db.new_article,
                                                                                        attributes: [
                                                                                                "avatar",
                                                                                                "slug",
                                                                                                "slug_crc",
                                                                                                "title",
                                                                                                "views",
                                                                                                "status",
                                                                                        ],
                                                                                        require: true,
                                                                                        where: {
                                                                                                status: 1,
                                                                                        },
                                                                                },
                                                                                {
                                                                                        model: db.new_category,
                                                                                        as: "category",
                                                                                },
                                                                        ],
                                                                        order: [
                                                                                [
                                                                                        {
                                                                                                model: db.new_article,
                                                                                        },
                                                                                        "views",
                                                                                        "DESC",
                                                                                ],
                                                                        ],
                                                                }
                                                        );
                                        }
                                        list_article_most_views.map((item) => {
                                                if (
                                                        fs.existsSync(
                                                                `src/uploadFile/avatars/${
                                                                        item
                                                                                .new_article
                                                                                .avatar +
                                                                        ".png"
                                                                }`
                                                        )
                                                ) {
                                                        // Tạo URL từ đường dẫn tới hình ảnh
                                                        const imageUrl = `http://localhost:4000/${item.new_article.avatar}.png`;
                                                        item.new_article.avatar =
                                                                imageUrl;
                                                }
                                        });
                                } else {
                                        list_article_most_views =
                                                await db.new_article.findAll({
                                                        where: [
                                                                {
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
                                                        order: [
                                                                [
                                                                        "views",
                                                                        "DESC",
                                                                ],
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
                                        list_article_most_views.map((item) => {
                                                // Tạo URL từ đường dẫn tới hình ảnh
                                                const imageUrl = `http://localhost:4000/${item.avatar}.png`;
                                                item.avatar = imageUrl;
                                        });
                                }
                                return list_article_most_views;
                        } catch (error) {
                                console.log(error);
                        }
                }),
                getByPublishAt: asyncHandler(async ({ page = 1, slug_crc }) => {
                        let list_article_new;
                        let queries = {};
                        (queries.limit = +process.env.LIMIT),
                                (queries.offset =
                                        (page - 1) * +process.env.LIMIT);
                        if (!slug_crc) {
                                list_article_new =
                                        await db.new_article.findAndCountAll({
                                                ...queries,
                                                where: { status: 1 },
                                                distinct: true,
                                                include: [
                                                        {
                                                                model: db.new_articles_category,
                                                                include: [
                                                                        {
                                                                                as: "category",
                                                                                model: db.new_category,
                                                                        },
                                                                ],
                                                        },
                                                ],
                                                order: [["publishAt", "DESC"]],
                                        });
                        } else {
                                const idCate = await db.new_category.findOne({
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
                }),
                getHotCategoryService: asyncHandler(async (slug_crc) => {
                        const res = await db.new_category.findOne({
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
                                                                },
                                                                require: true,
                                                        },
                                                ],
                                        },
                                ],
                        });

                        return res;
                }),
                getHotBoxSubCategoryService: asyncHandler(async (slug_crc) => {
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
                                const parent = await db.new_category.findOne({
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
                                                                [
                                                                        "position",
                                                                        "ASC",
                                                                ],
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
                }),
                getDetailService: asyncHandler(async (slug, slug_crc) => {
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
                                        await db.new_article.update(
                                                {
                                                        views:
                                                                article.views +
                                                                1,
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
                                                                        article_id: article.id,
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
                getAvatarService: async ({ slug_crc, height, width }) => {
                        // C:\Users\PC\Desktop\backend-learn-test\src\uploadFile\avatars\87802742.png
                        const path = `C:\\Users\\Admin\\OneDrive\\Desktop\\backend-learn\\src\\uploadFile\\avatars\\${slug_crc}.png`;
                        const avatarBuffer = await sharp(path)
                                .resize(parseInt(height), parseInt(width))
                                .toBuffer();
                        return avatarBuffer;
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
                                                        attributes: [
                                                                "slug",
                                                                "id",
                                                        ],
                                                },
                                        ],
                                });
                                for (
                                        let i = 0;
                                        i < articels.article.length;
                                        i++
                                ) {
                                        const slug_crc = crc32(
                                                articels.article[i].slug
                                        );
                                        const newArticle =
                                                await db.new_article.create({
                                                        ...articels.article[i],
                                                        slug_crc,
                                                });
                                        if (i < 9) {
                                                const res =
                                                        await db.new_articles_category.create(
                                                                {
                                                                        category_id:
                                                                                subCate.id,

                                                                        article_id: newArticle.id,
                                                                }
                                                        );
                                        } else if (
                                                subCate.new_categories.length >=
                                                Math.floor(i / 9)
                                        ) {
                                                const res =
                                                        await db.new_articles_category.create(
                                                                {
                                                                        category_id:
                                                                                subCate
                                                                                        .new_categories[
                                                                                        Math.floor(
                                                                                                i /
                                                                                                        9
                                                                                        ) -
                                                                                                1
                                                                                ]
                                                                                        .id,
                                                                        article_id: newArticle.id,
                                                                }
                                                        );

                                                const parent =
                                                        await db.new_articles_category.create(
                                                                {
                                                                        category_id:
                                                                                subCate.id,

                                                                        article_id: newArticle.id,
                                                                }
                                                        );
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
                                        categoryNew =
                                                await db.new_articles_category.findOne(
                                                        {
                                                                where: {
                                                                        article_id: article.id,
                                                                },
                                                        }
                                                );
                                }
                                const now = new Date();
                                const infor_article =
                                        await db.new_article.update(
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

                                const response =
                                        await db.new_articles_hot_category.create(
                                                {
                                                        article_id: article.id,
                                                        position,
                                                        category_id:
                                                                categoryNew.category_id,
                                                }
                                        );
                                position = position + 1;
                        }
                },
        },
};

module.exports = articlesService;
