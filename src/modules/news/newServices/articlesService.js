const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const articlesService = {
        getHotService: (req, res) => {
                return new Promise(async (resolve, reject) => {
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
                                                                ],
                                                        },
                                                ],
                                        });
                                const hot_categories =
                                        await db.new_category.findAll({
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
                                        attributes: [
                                                "title",
                                                "slug",
                                                "avatar",
                                                "sapo",
                                        ],
                                        where: {
                                                title: {
                                                        [Op.like]: `%${title}%`,
                                                },
                                        },
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
                                                resolve({
                                                        articles_category,
                                                        list_article_new,
                                                        status: 0,
                                                });
                                        }
                                } else {
                                        resolve({
                                                message: "Khong tim thay danh muc",
                                        });
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
                                        resolve({
                                                status: 0,
                                                message: "Đã tồn tại bài viết với title này ",
                                        });
                                } else {
                                        const newArticle =
                                                await db.new_article.create({
                                                        ...data,
                                                        slug_crc,
                                                });
                                        const response =
                                                await db.new_category.findOne({
                                                        where: {
                                                                [Op.or]: {
                                                                        id: data.category_id,
                                                                        parent_id: data.category_id,
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
                                                await db.new_articles_category.create(
                                                        {
                                                                category_id:
                                                                        data.category_id,
                                                                article_id: newArticle.id,
                                                        }
                                                );

                                        if (response.parent_id) {
                                                const parent =
                                                        await db.new_articles_category.create(
                                                                {
                                                                        category_id:
                                                                                response.parent_id,
                                                                        article_id: newArticle.id,
                                                                }
                                                        );
                                        }

                                        resolve({
                                                status: 0,
                                                message: "Đã thêm bài viết thành công",
                                                newArticle,
                                        });
                                }
                        } catch (error) {
                                console.log(error);
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
                                        const view =
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
                                        resolve({
                                                message: "Khong tim thay bai viet",
                                        });
                                }
                        } else {
                                resolve({ message: "Khong tim thay bai viet" });
                        }
                });
        },
        publishService: (article_id) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                const now = new Date();
                                const infor_article =
                                        await db.new_article.update(
                                                {
                                                        publishAt: now,
                                                },
                                                {
                                                        where: {
                                                                id: article_id,
                                                        },
                                                }
                                        );
                                resolve({
                                        message: "Xuat ban thanh cong",
                                        infor_article,
                                        status: 0,
                                });
                        } catch (error) {
                                reject(error);
                        }
                });
        },
        createHotMain: (data) => {
                return new Promise(async (resolve, reject) => {
                        const check = await db.new_articles_hot_main.findOne({
                                where: { article_id: data.article_id },
                        });
                        if (!check) {
                                // check position invalid
                                if (data.position < 1) {
                                        resolve({
                                                message: "Vi tri khong hop le",
                                        });
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
                                                                ...data,
                                                        }
                                                );
                                        resolve(response);
                                        resolve({
                                                message: "Bàn viết này đã được set trong tin nổi bật",
                                        });
                                } else {
                                        resolve({
                                                message: "Set vị trí nổi bật không thành công",
                                        });
                                }
                        } else {
                                resolve({
                                        message: "Bài viết chưa được xuất bản",
                                });
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
                        if (checkArticle) {
                                const res =
                                        await db.new_articles_hot_category.findOne(
                                                {
                                                        where: {
                                                                article_id: data.article_id,
                                                        },
                                                }
                                        );
                                if (res === null) {
                                        const categoryNew =
                                                await db.new_articles_category.findOne(
                                                        {
                                                                where: {
                                                                        article_id: data.article_id,
                                                                },
                                                        }
                                                );
                                        const response =
                                                await db.new_articles_hot_category.create(
                                                        {
                                                                ...data,
                                                                category_id:
                                                                        categoryNew.category_id,
                                                        }
                                                );
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
        updateHotMain: (data, id) => {
                return new Promise(async (resolve, reject) => {
                        const response = await db.new_articles_hot_main.update(
                                {
                                        position: data.position,
                                },
                                { where: { article_id: id } }
                        );
                        if (response !== null) {
                                resolve({
                                        message: "Cập nhật vị trí thành công",
                                });
                        }

                        resolve({
                                message: "Cập nhật vị trí không thành công",
                        });
                });
        },
        getByMostView: () => {
                return new Promise(async (resolve, reject) => {
                        const res = await db.new_article.findAll({
                                where: [
                                        {
                                                status: 1,
                                        },
                                ],
                                attributes: [
                                        "avatar",
                                        "slug",
                                        "slug_crc",
                                        "title",
                                        "views",
                                ],
                                order: [["views", "DESC"]],
                                limit: 5,
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
                        });
                        resolve(res);
                });
        },
        getByPublishAt: (slug) => {
                try {
                        return new Promise(async (resolve, reject) => {
                                const idBook = await db.new_category.findOne({
                                        where: [{ slug: "sach" }],
                                        attributes: [
                                                "id",
                                                "slug",
                                                "slug_crc",
                                                "parent_id",
                                                "name",
                                        ],
                                });
                                const list_article_new =
                                        await db.new_articles_category.findAll({
                                                where: {
                                                        [Op.not]: {
                                                                category_id:
                                                                        idBook.id,
                                                        },
                                                },
                                                include: [
                                                        {
                                                                model: db.new_article,
                                                                required: true,
                                                        },
                                                ],
                                                order: [
                                                        [
                                                                db.new_article,
                                                                "publishAt",
                                                                "DESC",
                                                        ],
                                                ],
                                        });

                                resolve(list_article_new);
                        });
                } catch (error) {
                        console.log(error);
                }
        },
        getHotCategoryService: (slug_crc) => {
                return new Promise(async (resolve, reject) => {
                        const res = await db.new_category.findAll({
                                where: {
                                        slug_crc,
                                },
                                attributes: ["name", "slug", "slug_crc"],
                                include: [
                                        {
                                                model: db.new_articles_hot_category,
                                                attributes: [
                                                        "article_id",
                                                        "position",
                                                ],
                                                order: [["position", "ASC"]],
                                                include: [
                                                        {
                                                                model: db.new_article,
                                                                attributes: [
                                                                        "avatar",
                                                                        "slug",
                                                                        "slug_crc",
                                                                        "title",
                                                                ],
                                                        },
                                                ],
                                        },
                                ],
                        });
                        resolve(res);
                });
        },
};

module.exports = articlesService;
