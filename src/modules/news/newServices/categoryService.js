const { Op } = require("sequelize");
const db = require("../../../config/newModels");
const crc32 = require("crc/crc32");
const asyncHandler = require("express-async-handler");
const categoryService = {
      create: async (data) => {
            const query = `SELECT CRC32('${data.slug}') AS crcValue;`;
            const result = await db.sequelize.query(query);
            const response = await db.new_category.create({
                  ...data,
                  slug_crc: result[0][0].crcValue,
                  status: 0,
                  position: null,
            });
            return response;
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

      getAll: () => {
            return new Promise(async (resolve, reject) => {
                  console.log(1);
                  try {
                        const response = await db.new_category.findAndCountAll({
                              where: {
                                    [Op.and]: [
                                          {
                                                parent_id: null,
                                          },
                                          {
                                                status: 1,
                                          },
                                    ],
                              },
                              require: false,
                              include: {
                                    model: db.new_category,
                                    as: "childCategories",
                                    attributes: [
                                          "name",
                                          "id",
                                          "slug",
                                          "slug_crc",
                                          "updatedAt",
                                          "createdAt",
                                          "status",
                                    ],
                                    where: {
                                          status: 1,
                                    },
                                    required: false,
                              },
                              order: [["position", "ASC"]],
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
                        let position = 1;
                        for (let cate of data) {
                              const slug_crc_cate = crc32(cate.slug);
                              const createCate = await db.new_category.create({
                                    ...cate,
                                    status: 1,
                                    slug_crc: slug_crc_cate,
                                    position,
                              });
                              ++position;
                              for (let subCate of cate.sub) {
                                    const slug_crc_subCate = crc32(
                                          subCate.slug
                                    );
                                    await db.new_category.create({
                                          ...subCate,
                                          status: 1,
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
      getAllByAdmin: async ({ page, name, ...query }) => {
            try {
                  let queries = {};
                  if (name) {
                        query.name = { [Op.substring]: name };
                  }
                  if (page) {
                        (queries.limit = +process.env.LIMIT),
                              (queries.offset =
                                    (page - 1) * +process.env.LIMIT);
                  }

                  const response = await db.new_category.findAndCountAll({
                        ...queries,
                        where: {
                              ...query,
                        },
                        include: [
                              {
                                    model: db.new_category,
                                    as: "parentCategory",
                              },
                        ],
                        distinct: true,
                  });
                  return response;
            } catch (error) {
                  console.log(error);
                  return error;
            }
      },
      deleteService: (id) => {
            return new Promise(async (resolve, reject) => {
                  try {
                        if (!Array.isArray(id)) {
                              id = [id];
                        }
                        await db.new_category.destroy({
                              where: {
                                    id: {
                                          [Op.in]: id,
                                    },
                              },
                        });
                        resolve({
                              message: "Delete category successfully",
                        });
                  } catch (error) {
                        reject({
                              message: "Delete category failed",
                        });
                  }
            });
      },
      updateService: async (data, id) => {
            if (!Array.isArray(id)) {
                  id = [id];
            }
            await db.new_category.update(
                  {
                        ...data,
                  },
                  {
                        where: {
                              id: {
                                    [Op.in]: id,
                              },
                        },
                  }
            );
      },
      updatePositionService: async (data) => {
            await db.new_category.update(
                  { position: null },
                  {
                        where: {
                              [Op.not]: {
                                    position: null,
                              },
                        },
                  }
            );
            data.map(async (category) => {
                  const res = await db.new_category.update(
                        {
                              position: category.position,
                        },
                        {
                              where: {
                                    id: category.id,
                              },
                        }
                  );
            });
            return { message: "Update position successfully" };
      },
};

module.exports = categoryService;
