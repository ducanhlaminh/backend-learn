const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const fs = require("fs");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { log } = require("console");
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

                                hot_main.map((item) => {
                                        if (
                                                fs.existsSync(
                                                        `src/uploadFile/avatars/${
                                                                item.new_article
                                                                        .avatar +
                                                                ".png"
                                                        }`
                                                )
                                        ) {
                                                // Tạo URL từ đường dẫn tới hình ảnh
                                                const imageUrl = `http://localhost:4000/${item.new_article.avatar}.png`;
                                                item.new_article.avatar =
                                                        imageUrl;
                                        } else {
                                        }
                                });
                                return {
                                        hot_main,
                                };
                        } catch (error) {
                                return error;
                        }
                }),
                getByTitleService: asyncHandler(async (title, category_id) => {
                        try {
                                if (category_id) {
                                        const articles =
                                                await db.new_articles_category.findAll(
                                                        {
                                                                where: {
                                                                        category_id,
                                                                },
                                                                include: {
                                                                        model: db.new_article,
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
                                                                attributes: [
                                                                        "title",
                                                                        "slug",
                                                                        "avatar",
                                                                        "sapo",
                                                                        "publishAt",
                                                                        "id",
                                                                ],
                                                                where: {
                                                                        title: {
                                                                                [Op.like]: `%${title}%`,
                                                                        },
                                                                        status: 1,
                                                                },
                                                                limit: 15,
                                                                order: [
                                                                        [
                                                                                "publishAt",
                                                                                "DESC",
                                                                        ],
                                                                ],
                                                        }
                                                );
                                        articles.rows.map((item) => {
                                                if (
                                                        fs.existsSync(
                                                                `src/uploadFile/avatars/${
                                                                        item.avatar +
                                                                        ".png"
                                                                }`
                                                        )
                                                ) {
                                                        // Tạo URL từ đường dẫn tới hình ảnh
                                                        const imageUrl = `http://localhost:4000/${item.avatar}.png`;
                                                        item.avatar = imageUrl;
                                                } else {
                                                }
                                        });
                                        return {
                                                data: articles,
                                                status: 0,
                                        };
                                }
                        } catch (error) {
                                return error;
                        }
                }),
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
                        if (slug_crc) {
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
                                                                item.avatar +
                                                                ".png"
                                                        }`
                                                )
                                        ) {
                                                // Tạo URL từ đường dẫn tới hình ảnh
                                                const imageUrl = `http://localhost:4000/${item.avatar}.png`;
                                                item.avatar = imageUrl;
                                        } else {
                                        }
                                });
                                list_article_most_views.map((item) => {
                                        if (
                                                fs.existsSync(
                                                        `src/uploadFile/avatars/${
                                                                item.new_article
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
                                        if (
                                                fs.existsSync(
                                                        `src/uploadFile/avatars/${
                                                                item.avatar +
                                                                ".png"
                                                        }`
                                                )
                                        ) {
                                                // Tạo URL từ đường dẫn tới hình ảnh
                                                const imageUrl = `http://localhost:4000/${item.avatar}.png`;
                                                item.avatar = imageUrl;
                                        }
                                });
                        }

                        return list_article_most_views;
                }),
                getByPublishAt: asyncHandler(async ({ page = 1, slug_crc }) => {
                        let list_article_new;
                        let queries = {};
                        (queries.limit = +process.env.LIMIT),
                                (queries.offset =
                                        (page - 1) * +process.env.LIMIT);
                        if (!slug_crc) {
                                const idBook = await db.new_category.findOne({
                                        where: [
                                                {
                                                        slug: "Xuất bản",
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
                                list_article_new =
                                        await db.new_article.findAndCountAll({
                                                ...queries,
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
                                list_article_new.rows.map((item) => {
                                        if (
                                                fs.existsSync(
                                                        `src/uploadFile/avatars/${
                                                                item.avatar +
                                                                ".png"
                                                        }`
                                                )
                                        ) {
                                                // Tạo URL từ đường dẫn tới hình ảnh
                                                const imageUrl = `http://localhost:4000/${item.avatar}.png`;
                                                item.avatar = imageUrl;
                                        } else {
                                        }
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
                                                                where: {
                                                                        category_id:
                                                                                idCate.id,
                                                                },
                                                                include: [
                                                                        {
                                                                                model: db.new_article,
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
                                list_article_new.map((item) => {
                                        if (
                                                fs.existsSync(
                                                        `src/uploadFile/avatars/${
                                                                item.new_article
                                                                        .avatar +
                                                                ".png"
                                                        }`
                                                )
                                        ) {
                                                // Tạo URL từ đường dẫn tới hình ảnh
                                                const imageUrl = `http://localhost:4000/${item.new_article.avatar}.png`;
                                                item.new_article.avatar =
                                                        imageUrl;
                                        } else {
                                        }
                                });
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
                                                        },
                                                ],
                                        },
                                ],
                        });
                        res.new_articles_hot_categories.map((item) => {
                                if (
                                        fs.existsSync(
                                                `src/uploadFile/avatars/${
                                                        item.new_article
                                                                .avatar + ".png"
                                                }`
                                        )
                                ) {
                                        // Tạo URL từ đường dẫn tới hình ảnh
                                        const imageUrl = `http://localhost:4000/${item.new_article.avatar}.png`;
                                        item.new_article.avatar = imageUrl;
                                } else {
                                }
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
                                                console.log();
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
                                        const res =
                                                await db.new_articles_category.findOne(
                                                        {
                                                                where: [
                                                                        {
                                                                                article_id:
                                                                                        article.id ||
                                                                                        0,
                                                                        },
                                                                ],
                                                        }
                                                );

                                        const category =
                                                await db.new_category.findOne({
                                                        where: [
                                                                {
                                                                        id: res?.category_id,
                                                                },
                                                        ],
                                                        attributes: [
                                                                "name",
                                                                "id",
                                                                "slug",
                                                        ],
                                                });
                                        const cateChild =
                                                await db.new_category.findOne({
                                                        where: [
                                                                {
                                                                        parent_id: res.category_id,
                                                                },
                                                        ],
                                                        attributes: [
                                                                "name",
                                                                "id",
                                                                "slug",
                                                        ],
                                                });
                                        const articlesCate =
                                                await db.new_category.findAll({
                                                        attributes: [
                                                                "name",
                                                                "id",
                                                                "slug",
                                                        ],
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
                                                                                        as: "articles",
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
                                                                        as: "articles",
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
                }),
        },
        update: {
                updateHotMain: async (data, id) => {
                        const checkPosition =
                                await db.new_articles_hot_main.findOne({
                                        where: { position: data.position },
                                });
                        const checkIdArticle =
                                await db.new_articles_hot_main.findOne({
                                        where: { article_id: id },
                                });
                        if (!checkPosition) {
                                await db.new_articles_hot_main.destroy({
                                        where: {
                                                article_id: id,
                                        },
                                });
                                await db.new_articles_hot_main.create({
                                        position: data.position,
                                        article_id: id,
                                });
                        } else {
                                const article =
                                        await db.new_articles_hot_main.findOne({
                                                where: { article_id: id },
                                        });
                                const tempValue = checkPosition.position;
                                checkPosition.position = article.position;
                                article.position = tempValue;
                                await article.save();
                                await checkPosition.save();
                        }
                        return {
                                message: "Cập nhật vị trí thành công",
                        };
                },
                updateHotCate: async (data, id) => {
                        try {
                                const checkPosition =
                                        await db.new_articles_hot_category.findOne(
                                                {
                                                        where: {
                                                                position: data.position,
                                                        },
                                                }
                                        );
                                if (checkPosition) {
                                        const article =
                                                await db.new_articles_hot_category.findOne(
                                                        {
                                                                where: {
                                                                        article_id: id,
                                                                },
                                                        }
                                                );
                                        const tempValue =
                                                checkPosition.position;
                                        checkPosition.position =
                                                article.position;
                                        article.position = tempValue;
                                        await article.save();
                                        await checkPosition.save();
                                } else {
                                        await db.new_articles_hot_category.update(
                                                {
                                                        ...data,
                                                },
                                                {
                                                        where: {
                                                                article_id: id,
                                                        },
                                                }
                                        );
                                }

                                return {
                                        message: "Cập nhật vị trí thành công",
                                };
                        } catch (error) {
                                return {
                                        message: error,
                                };
                        }
                        // const check =
                        //         await db.new_articles_hot_category.findOne({
                        //                 where: {
                        //                         article_id: id,
                        //                 },
                        //         });
                        //         if(!check){
                        //                 await db.new_articles_hot_category.create({
                        //                         article_id: id,
                        //                 });
                        //         }

                        // if (!checkCategory) {
                        //         await db.new_articles_hot_category.update(
                        //                 {
                        //                         category_id:data.category_id
                        //                 },
                        //                 {
                        //                         where: {
                        //                                 article_id: id,
                        //                         },
                        //                 }
                        //         );
                        // }
                        // if (!checkPosition) {
                        //         await db.new_articles_hot_category.update(
                        //                 {
                        //                         ...data,
                        //                 },
                        //                 {
                        //                         where: {
                        //                                 article_id: id,
                        //                         },
                        //                 }
                        //         );
                        //         return {
                        //                 message: "Cập nhật vị trí thành công",
                        //         };
                        // } else {
                        //         const article =
                        //                 await db.new_articles_hot_category.findOne(
                        //                         {
                        //                                 where: {
                        //                                         article_id: id,
                        //                                 },
                        //                         }
                        //                 );
                        //         const tempValue = checkPosition.position;
                        //         checkPosition.position = article.position;
                        //         article.position = tempValue;
                        //         await article.save();
                        //         await checkPosition.save();
                        //
                        // }
                },
                publishService: async (article_id) => {
                        try {
                                const now = new Date();
                                const infor_article =
                                        await db.new_article.update(
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
                                where: { article_id: data.id },
                        });
                        if (!check) {
                                // check position invalid
                                if (data.position < 1) {
                                        return {
                                                message: "Vi tri khong hop le",
                                        };
                                }
                                // Check tại vị trí đó còn trống không
                                const checkPosition =
                                        await db.new_articles_hot_main.findOne({
                                                where: {
                                                        position: data.position,
                                                },
                                        });
                                if (checkPosition === null) {
                                        const response =
                                                await db.new_articles_hot_main.create(
                                                        {
                                                                article_id: data.id,
                                                                position: data.position,
                                                        }
                                                );
                                        return response;
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
                        const response =
                                await db.new_articles_hot_category.create({
                                        ...data,
                                });
                        return response;
                },
                createArticleService: async (file, data) => {
                        const slug_crc = crc32(data.slug);
                        const ext = file.originalname.split(".").pop();
                        const newFilePath = `src/uploadFile/avatarArticles/${
                                slug_crc + "." + ext
                        }`;
                        let avatar = fs.readFileSync(file.path, "base64");
                        avatar = `data:image/png;base64,` + avatar;

                        // fs.rename(file.path, newFilePath, (error) => {
                        //         if (error) {
                        //                 console.log(error);
                        //                 return;
                        //         }
                        // });

                        try {
                                const [articel, created] =
                                        await db.new_article.findOrCreate({
                                                where: {
                                                        slug_crc: slug_crc,
                                                },
                                                defaults: {
                                                        slug: data.slug,
                                                        slug_crc,
                                                        sapo: data.sapo,
                                                        title: data.title,
                                                },
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

                                const res =
                                        await db.new_articles_category.create({
                                                category_id: data.categoryId,
                                                article_id: articel.id,
                                        });
                                if (category.parent_id) {
                                        const parent =
                                                await db.new_articles_category.create(
                                                        {
                                                                category_id:
                                                                        category.parent_id,
                                                                article_id: articel.id,
                                                        }
                                                );
                                }
                                return { ...articel.dataValues, avatar };
                        } catch (error) {
                                console.log(error);
                                return {
                                        message: "Failed at articleService",
                                };
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
        delete: {
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
};

module.exports = articlesService;
