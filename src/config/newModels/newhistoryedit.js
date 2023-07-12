"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
        class NewHistoryEdit extends Model {
                /**
                 * Helper method for defining associations.
                 * This method is not a part of Sequelize lifecycle.
                 * The `models/index` file will call this method automatically.
                 */
                static associate(models) {
                        // define association here
                }
        }
        NewHistoryEdit.init(
                {
                        articles_id: DataTypes.NUMBER,
                        user_id: DataTypes.NUMBER,
                        data: DataTypes.STRING,
                        updatedAt: DataTypes.DATE,
                        createdAt: DataTypes.DATE,
                },
                {
                        sequelize,
                        modelName: "NewHistoryEdit",
                }
        );
        return NewHistoryEdit;
};
