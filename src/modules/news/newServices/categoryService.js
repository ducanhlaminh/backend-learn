const { Op } = require("sequelize");
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
                                const response = await db.new_category.findOne({
                                        where: {
                                                slug_crc,
                                        },
                                        include: {
                                                as: "childCategories",
                                                model: db.new_category,
                                        },
                                });
                                resolve(response);
                        } catch (error) {
                                reject(error);
                        }
                });
        },
        getByNameService: async (name) => {
                console.log(name);
                const response = await db.new_category.findAll({
                        where: {
                                slug: {
                                        [Op.like]: `%${name}%`,
                                },
                        },
                        attributes: ["name", "id", "slug"],
                        limit: 5,
                });
                console.log(response);
                return response;
        },
        getAll: () => {
                return new Promise(async (resolve, reject) => {
                        try {
                                const response =
                                        await db.new_category.findAndCountAll({
                                                attributes: [
                                                        "name",
                                                        "id",
                                                        "slug",
                                                        "slug_crc",
                                                        "updatedAt",
                                                        "createdAt",
                                                ],

                                                where: [
                                                        {
                                                                parent_id: null,
                                                        },
                                                ],
                                                include: {
                                                        model: db.new_category,
                                                        as: "childCategories",
                                                        attributes: [
                                                                "name",
                                                                "id",
                                                                "slug",
                                                                "slug_crc",
                                                                "updatedAt",
                                                        ],
                                                },
                                        });
                                resolve(response);
                        } catch (error) {
                                reject(error);
                        }
                });
        },
        insertDataService: (data) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                for (let cate of data) {
                                        const slug_crc_cate = crc32(cate.slug);
                                        const createCate =
                                                await db.new_category.create({
                                                        ...cate,
                                                        slug_crc: slug_crc_cate,
                                                });
                                        for (let subCate of cate.sub) {
                                                const slug_crc_subCate = crc32(
                                                        subCate.slug
                                                );
                                                await db.new_category.create({
                                                        ...subCate,
                                                        slug_crc: slug_crc_subCate,
                                                        parent_id: createCate.id,
                                                });
                                        }
                                }
                                resolve("Successfully created");
                        } catch (error) {
                                console.log(error);
                        }
                });
        },
        // Admin
        getAllByAdmin: () => {
                return new Promise(async (resolve, reject) => {
                        try {
                                const response =
                                        await db.new_category.findAndCountAll({
                                                where: [
                                                        {
                                                                parent_id: null,
                                                        },
                                                ],
                                                include: [
                                                        {
                                                                model: db.new_category,
                                                                as: "childCategories",
                                                                include: [
                                                                        {
                                                                                model: db.new_articles_category,
                                                                                attributes: [
                                                                                        "id",
                                                                                ],
                                                                                as: "articles",
                                                                        },
                                                                ],
                                                        },
                                                        {
                                                                model: db.new_articles_category,
                                                                attributes: [
                                                                        "id",
                                                                ],
                                                                as: "articles",
                                                        },
                                                ],
                                        });
                                resolve(response);
                        } catch (error) {
                                reject(error);
                        }
                });
        },
        deleteService: (id) => {
                return new Promise(async (resolve, reject) => {
                        try {
                                if (!id)
                                        resolve({
                                                message: "Delete category failed",
                                        });
                                await db.new_category.destroy({
                                        where: {
                                                id,
                                        },
                                });
                                resolve({
                                        message: "Delete category successfully",
                                });
                        } catch (error) {
                                reject(error);
                        }
                });
        },
};

module.exports = categoryService;
