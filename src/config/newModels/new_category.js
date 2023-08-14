"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
        class new_category extends Model {
                /**
                 * Helper method for defining associations.
                 * This method is not a part of Sequelize lifecycle.
                 * The `models/index` file will call this method automatically.
                 */
                static associate(models) {
                        new_category.hasMany(models.new_category, {
                                foreignKey: "parent_id",
                                as: "childCategories",
                        });
                        new_category.belongsTo(models.new_category, {
                                foreignKey: "parent_id",
                                as: "parentCategory",
                        });
                        new_category.hasMany(models.new_articles_category, {
                                foreignKey: "category_id",
                                as: "articles",
                        });
                        new_category.hasMany(models.new_articles_hot_category, {
                                foreignKey: "category_id",
                        });
                        // define association here
                }
        }
        new_category.init(
                {
                        name: DataTypes.STRING,
                        slug: DataTypes.STRING,
                        slug_crc: DataTypes.BIGINT,
                        parent_id: DataTypes.INTEGER,
                        position: DataTypes.INTEGER,
                        status: DataTypes.INTEGER,
                        updated_user_id: DataTypes.INTEGER,
                        created_user_id: DataTypes.INTEGER,
                        updatedAt: DataTypes.DATE,
                        createdAt: DataTypes.DATE,
                },
                {
                        sequelize,
                        modelName: "new_category",
                }
        );
        return new_category;
};
