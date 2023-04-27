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
                                as: "parent_category",
                        });
                        // new_category.hasMany(models.NewArticlesCategory, {
                        //         foreignKey: "category_id",
                        //         as: "data_category",
                        // });
                        // define association here
                }
        }
        new_category.init(
                {
                        name: DataTypes.STRING,
                        slug: DataTypes.STRING,
                        slug_src: DataTypes.NUMBER,
                        parent_id: DataTypes.NUMBER,
                        updated_user_id: DataTypes.NUMBER,
                        created_user_id: DataTypes.NUMBER,
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
