const db = require("../../../../models");
const { Op } = require("sequelize");
const articlesService = {
        getAllService: (req, res) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                const articles = await db.new_article.findAll();
                                resolve({
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
                                        where: { title: title },
                                });
                                resolve({
                                        articles,
                                        status: 0,
                                });
                        } catch (error) {
                                reject(error);
                        }
                });
        },
        getByCateService: (id) => {
                console.log("id", id);
                return new Promise(async (resolve, reject) => {
                        try {
                                const cate = await db.new_category.findAll({
                                        where: {
                                                [Op.or]: [
                                                        { id },
                                                        { parent_id: id },
                                                ],
                                        },
                                });
                                console.log(cate.map((item) => item.id));
                                const articlesCate =
                                        await db.new_articles_category.findAll({
                                                where: {
                                                        category_id: cate.map(
                                                                (item) =>
                                                                        item.id
                                                        ),
                                                },
                                                include: [
                                                        {
                                                                model: db.new_article,
                                                                as: "data",
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
                                        const response =
                                                await db.new_article.create({
                                                        ...data,
                                                });
                                        // const res =
                                        //         await db.new_articles_category.create(
                                        //                 {
                                        //                         articles_id:
                                        //                                 response.id,
                                        //                         category_id:
                                        //                                 data.category_id,
                                        //                 }
                                        //         );
                                        // console.log(res);
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
