"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init(
        {
            name: DataTypes.STRING,
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
            role_id: DataTypes.NUMBER,
            typeLogin: DataTypes.NUMBER,
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
