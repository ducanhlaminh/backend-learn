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
                        as: "childCategories",
                        foreignKey: "parent_id",
                  });
                  new_category.hasMany(models.new_articles_category, {
                        foreignKey: "category_id",
                  });
                  // define association here
            }
      }
      new_category.init(
            {
                  name: DataTypes.STRING,
                  slug: DataTypes.STRING,
                  slug_crc: DataTypes.NUMBER,
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
