"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
        class Users extends Model {
                /**
                 * Helper method for defining associations.
                 * This method is not a part of Sequelize lifecycle.
                 * The `models/index` file will call this method automatically.
                 */
                static associate(models) {
                        Users.hasMany(models.NewHistoryEdit, {
                                foreignKey: "user_id",
                                as: "data_user_edit",
                        });
                        Users.hasMany(models.new_article, {
                                foreignKey: "created_user_id",
                                as: "data_article",
                        });
                        Users.hasMany(models.new_category, {
                                foreignKey: "created_user_id",
                                as: "data_category_create",
                        });
                        Users.hasOne(models.new_category, {
                                foreignKey: "updated_user_id",
                                as: "data_category_update",
                        });

                        // define association here
                }
        }
        Users.init(
                {
                        name: DataTypes.STRING,
                        email: DataTypes.STRING,
                        password: DataTypes.STRING,
                        role_id: DataTypes.NUMBER,
                        updatedAt: DataTypes.DATE,
                        createdAt: DataTypes.DATE,
                },
                {
                        sequelize,
                        modelName: "Users",
                }
        );
        return Users;
};
