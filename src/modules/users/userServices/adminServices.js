const db = require("../../../config/newModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const path = require("path");
const sharp = require("sharp");

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
                                                                item.avatar =
                                                                        imageUrl;
                                                        } else {
                                                        }
                                                });
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
                updateArticleService: async (article_id, data, file) => {
                        try {
                                const now = new Date();
                                let infor = null;
                                if (file) {
                                        console.log("path", file.path);
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
                                                        console.log(
                                                                "error",
                                                                error
                                                        );
                                                }
                                        );
                                }
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
                                if (category?.parent_id) {
                                        const parent =
                                                await db.new_articles_category.create(
                                                        {
                                                                category_id:
                                                                        category.parent_id,
                                                                article_id: articel.id,
                                                        }
                                                );
                                }
                                return { ...articel.dataValues };
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
                                const slug_crc = crc32(name);
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
                                        const Path = `src/uploadFile/avatars/${
                                                name + ".png"
                                        }`;
                                        const newFilePath = `src/uploadFile/avatars/${
                                                slug_crc + ".png"
                                        }`;
                                        fs.writeFileSync(Path, imageBuffer);
                                        sharp(Path)
                                                .resize(500, 500)
                                                .toFile(
                                                        newFilePath,
                                                        (err, info) => {
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
                                                                        fs.unlink(
                                                                                Path,
                                                                                (
                                                                                        err
                                                                                ) => {
                                                                                        if (
                                                                                                err
                                                                                        ) {
                                                                                                console.error(
                                                                                                        "Lỗi khi xóa tệp tin:",
                                                                                                        err
                                                                                                );
                                                                                        } else {
                                                                                                console.log(
                                                                                                        "Tệp tin đã được xóa thành công."
                                                                                                );
                                                                                        }
                                                                                }
                                                                        );
                                                                }
                                                        }
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
                                        var newArticle;
                                        const slug_crc = crc32(
                                                articels.article[i].slug
                                        );
                                        try {
                                                await downloadImage(
                                                        articels.article[i],
                                                        articels.article[i]
                                                                .slug,
                                                        imageDirectory
                                                );
                                                newArticle =
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
                                                newArticle =
                                                        await db.new_article.create(
                                                                {
                                                                        ...articels
                                                                                .article[
                                                                                i
                                                                        ],
                                                                        slug_crc,
                                                                }
                                                        );
                                                continue;
                                        }

                                        if (i < 9) {
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
                                                                        ].id,
                                                                article_id: newArticle.id,
                                                        }
                                                );
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
