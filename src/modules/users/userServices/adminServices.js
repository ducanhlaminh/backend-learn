const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const path = require("path");
const adminServices = {
        get: {
                getAllService: asyncHandler(
                        async ({ page = 1, category_id, order }) => {
                                let queries = {};
                                (queries.limit = +process.env.LIMIT),
                                        (queries.offset =
                                                (page - 1) *
                                                +process.env.LIMIT);
                                if (order) queries.order = JSON.parse(order);
                                try {
                                        let articles;
                                        if (!category_id) {
                                                articles =
                                                        await db.new_article.findAndCountAll(
                                                                {
                                                                        ...queries,
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
                                                                }
                                                        );
                                        } else {
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
                                                        (item) =>
                                                                item.article_id
                                                );
                                                articles =
                                                        await db.new_article.findAll(
                                                                {
                                                                        where: {
                                                                                id: articlesId,
                                                                        },
                                                                        ...queries,
                                                                }
                                                        );
                                        }
                                        articles.rows.map((article) => {
                                                if (!article.avatar) {
                                                        const path = `src/uploadFile/avatarArticles/${
                                                                article.slug_crc +
                                                                ".png"
                                                        }`;
                                                        const url =
                                                                fs.readFileSync(
                                                                        path,
                                                                        "base64"
                                                                );
                                                        if (url) {
                                                                article.avatar = `data:image/png;base64,${url}`;
                                                        }
                                                }
                                        });

                                        return articles;
                                } catch (error) {
                                        console.log(error);
                                        return {
                                                message: "Failed to get articles",
                                        };
                                }
                        }
                ),
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
                updateArticleService: asyncHandler(async (article_id, data) => {
                        try {
                                const now = new Date();
                                let infor = null;
                                console.log(data.publishAt === true, data);
                                if (data.publishAt === true) {
                                        infor = {
                                                ...data,
                                                publishAt: now,
                                                status: 1,
                                        };
                                } else {
                                        infor = {
                                                ...data,
                                        };
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
                                                        }
                                                );
                                                const category =
                                                        await db.new_category.findOne(
                                                                {
                                                                        where: {
                                                                                id: data.category_id,
                                                                        },
                                                                }
                                                        );

                                                await db.new_articles_category.create(
                                                        {
                                                                category_id:
                                                                        data.category_id,
                                                                article_id,
                                                        }
                                                );
                                                if (category?.parent_id) {
                                                        await db.new_articles_category.create(
                                                                {
                                                                        category_id:
                                                                                category.parent_id,
                                                                        article_id,
                                                                }
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
                                                message: "Xuat ban thanh cong",
                                                status: 0,
                                        };
                                }
                        } catch (error) {
                                console.log(error);
                        }
                }),
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
                        const newFilePath = `src/uploadFile/avatars/${
                                slug_crc + "." + ext
                        }`;
                        let avatar = fs.readFileSync(file.path, "base64");
                        avatar = `data:image/png;base64,` + avatar;
                        fs.rename(file.path, newFilePath, (error) => {
                                if (error) {
                                        console.log(error);
                                        return;
                                }
                        });
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
                        const imageDirectory = "/src/uploadFile/avatars";

                        async function downloadImage(object, name, pathDir) {
                                try {
                                        const response = await axios.get(
                                                object.avatar,
                                                {
                                                        responseType:
                                                                "arraybuffer",
                                                }
                                        );
                                        const imageBuffer = Buffer.from(
                                                response.data,
                                                "binary"
                                        );
                                        const newFilePath = `src/uploadFile/avatars/${
                                                name + ".png"
                                        }`;

                                        fs.writeFileSync(
                                                newFilePath,
                                                imageBuffer
                                        );
                                        console.log(
                                                `đã được tải về và lưu trong `
                                        );
                                } catch (error) {}
                        }
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
                                        try {
                                                let a = await downloadImage(
                                                        articels.article[i],
                                                        slug_crc,
                                                        imageDirectory
                                                );
                                                const newArticle =
                                                        await db.new_article.create(
                                                                {
                                                                        ...articels
                                                                                .article[
                                                                                i
                                                                        ],
                                                                        slug_crc,
                                                                        avatar: slug_crc,
                                                                }
                                                        );
                                        } catch (error) {
                                                continue;
                                        }
                                        const stats = fs.statSync(
                                                `src/uploadFile/avatars/${
                                                        slug_crc + ".png"
                                                }`
                                        );
                                        var dataArticel;
                                        if (stats.isFile()) {
                                                dataArticel = {};
                                        } else {
                                                dataArticel = {
                                                        ...articels.article[i],
                                                        slug_crc,
                                                };
                                        }

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

module.exports = adminServices;
