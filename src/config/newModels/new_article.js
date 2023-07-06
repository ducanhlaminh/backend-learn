"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
        class new_article extends Model {
                /**
                 * Helper method for defining associations.
                 * This method is not a part of Sequelize lifecycle.
                 * The `models/index` file will call this method automatically.
                 */
                static associate(models) {
                        new_article.hasMany(models.new_articles_category, {
                                foreignKey: "article_id",
                        });
                        new_article.hasMany(models.NewHistoryEdit, {
                                foreignKey: "articles_id",
                        });

                        // define association here
                }
        }
        new_article.init(
                {
                        title: DataTypes.STRING,
                        slug: DataTypes.STRING,
                        slug_crc: DataTypes.BIGINT,
                        content: DataTypes.STRING,
                        sapo: DataTypes.STRING,
                        avatar: DataTypes.STRING,
                        views: DataTypes.NUMBER,
                        publishAt: DataTypes.DATE,
                        status: DataTypes.NUMBER,
                        created_user_id: DataTypes.NUMBER,
                        updatedAt: DataTypes.DATE,
                        createdAt: DataTypes.DATE,
                },
                {
                        sequelize,
                        modelName: "new_article",
                }
        );
        return new_article;
};
