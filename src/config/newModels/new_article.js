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

            // define association here
        }
    }
    new_article.init(
        {
            title: {
                type: DataTypes.STRING,
                // allowNull: false,
                // unique: true,
            },
            slug: DataTypes.STRING,
            slug_crc: DataTypes.BIGINT,
            content: DataTypes.TEXT("long"),
            sapo: DataTypes.STRING,
            avatar: DataTypes.STRING,
            views: DataTypes.INTEGER,
            publishAt: DataTypes.DATE,
            status: DataTypes.INTEGER,
            created_user_id: DataTypes.INTEGER,
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
