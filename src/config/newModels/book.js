"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
      class new_book extends Model {
            /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
            static associate(models) {
                  // define association here
            }
      }
      new_book.init(
            {
                  slug: DataTypes.STRING,
                  slug_crc: DataTypes.NUMBER,
                  content: DataTypes.STRING,
                  sapo: DataTypes.STRING,
                  status: DataTypes.NUMBER,
                  views: DataTypes.NUMBER,
                  created_user_id: DataTypes.STRING,
                  publishAt: DataTypes.DATE,
                  title: DataTypes.STRING,
                  avatar: DataTypes.STRING,
            },
            {
                  sequelize,
                  modelName: "new_book",
            }
      );
      return new_book;
};
