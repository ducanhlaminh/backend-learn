const { Sequelize } = require("sequelize");
const db = require("../../../config/newModels");
const crc32 = require("crc/crc32");
const categoryService = {
        create: (data) => {
                return new Promise(async (resolve, reject) => {
                        const query = `SELECT CRC32('${data.slug}') AS crcValue;`;
                        const result = await db.sequelize.query(query);
                        try {
                                const response = await db.new_category.create({
                                        ...data,
                                        slug_crc: result[0][0].crcValue,
                                });
                                resolve(response);
                        } catch (error) {
                                console.log(error);
                        }
                });
        },
        getSubCateService: (slug_crc) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                console.log(slug_crc);
                                const response = await db.new_category.findOne({
                                        where: {
                                                slug_crc,
                                        },
                                        include: {
                                                model: db.new_category,
                                        },
                                });
                                resolve(response);
                        } catch (error) {
                                reject(error);
                        }
                });
        },

        getAll: () => {
                return new Promise(async (resolve, reject) => {
                        try {
                                const response = await db.new_category.findAll({
                                        attributes: [
                                                "name",
                                                "id",
                                                "slug",
                                                "slug_crc",
                                        ],

                                        where: [
                                                {
                                                        parent_id: null,
                                                },
                                        ],
                                        include: {
                                                model: db.new_category,
                                                attributes: [
                                                        "name",
                                                        "id",
                                                        "slug",
                                                        "slug_crc",
                                                ],
                                        },
                                });
                                resolve({ categories: response });
                        } catch (error) {
                                reject(error);
                        }
                });
        },
};

module.exports = categoryService;
