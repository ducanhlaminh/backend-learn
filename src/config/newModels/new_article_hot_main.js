"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
        class new_articles_hot_main extends Model {
                /**
                 * Helper method for defining associations.
                 * This method is not a part of Sequelize lifecycle.
                 * The `models/index` file will call this method automatically.
                 */
                static associate(models) {
                        new_articles_hot_main.belongsTo(models.new_article, {
                                foreignKey: "article_id",
                        });
                        // define association here
                }
        }
        new_articles_hot_main.init(
                {
                        article_id: DataTypes.INTEGER,
                        position: DataTypes.INTEGER,
                        updatedAt: DataTypes.DATE,
                        createdAt: DataTypes.DATE,
                },
                {
                        sequelize,
                        modelName: "new_articles_hot_main",
                }
        );
        return new_articles_hot_main;
};
