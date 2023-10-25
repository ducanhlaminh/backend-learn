"use strict";
const { Model } = require("sequelize");
const db = require("../newModels/");
module.exports = (sequelize, DataTypes) => {
        class User extends Model {
                /**
                 * Helper method for defining associations.
                 * This method is not a part of Sequelize lifecycle.
                 * The `models/index` file will call this method automatically.
                 */
                static associate(models) {
                        // define association here
                        // User.hasMany(db.new_article, {
                        //     foreignKey: "created_user_id",
                        // });
                        // db.new_article.belongsTo(User, {
                        //     foreignKey: "created_user_id",
                        // });
                }
        }
        User.init(
                {
                        name: DataTypes.STRING,
                        userName: DataTypes.STRING,
                        email: {
                                type: DataTypes.STRING,
                                validate: {
                                        isEmail: true,
                                },
                        },
                        avatar: DataTypes.STRING,
                        password: {
                                type: DataTypes.STRING,
                        },
                        role_id: DataTypes.INTEGER,
                        typeLogin: DataTypes.INTEGER,
                        tokenOAuth: DataTypes.STRING,
                        updatedAt: DataTypes.DATE,
                        createdAt: DataTypes.DATE,
                },
                {
                        sequelize,
                        modelName: "User",
                }
        );
        return User;
};
