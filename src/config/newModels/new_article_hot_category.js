"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
      class new_articles_hot_category extends Model {
            /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
            static associate(models) {
                  // define association here
            }
      }
      new_articles_hot_category.init(
            {
                  article_id: DataTypes.NUMBER,
                  category_id: DataTypes.NUMBER,
                  position: DataTypes.NUMBER,
                  updatedAt: DataTypes.DATE,
                  createdAt: DataTypes.DATE,
            },
            {
                  sequelize,
                  modelName: "new_articles_hot_category",
            }
      );
      return new_articles_hot_category;
};
