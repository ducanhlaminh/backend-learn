"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            userName: {
                type: Sequelize.STRING,
            },
            avatar: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            tokenOAuth: {
                type: Sequelize.STRING,
            },
            typeLogin: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            password: {
                type: Sequelize.STRING,
            },
            role_id: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            },
            createdAt: {
                allowNull: false,
                type: "TIMESTAMP",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: "TIMESTAMP",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    },
};
