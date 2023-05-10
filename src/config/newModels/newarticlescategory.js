"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
      class new_articles_category extends Model {
            /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
            static associate(models) {
                  new_articles_category.belongsTo(models.new_article, {
                        foreignKey: "article_id",
                  });
                  new_articles_category.belongsTo(models.new_category, {
                        foreignKey: "category_id",
                        as: "dataCategory",
                  });

                  // define association here
            }
      }
      new_articles_category.init(
            {
                  article_id: DataTypes.NUMBER,
                  category_id: DataTypes.NUMBER,
            },
            {
                  sequelize,
                  modelName: "new_articles_category",
            }
      );
      return new_articles_category;
};
