"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
        async up(queryInterface, Sequelize) {
                await queryInterface.createTable("new_history_edits", {
                        id: {
                                allowNull: false,
                                autoIncrement: true,
                                primaryKey: true,
                                type: Sequelize.INTEGER,
                        },
                        articles_id: {
                                type: Sequelize.INTEGER,
                        },
                        user_id: {
                                type: Sequelize.INTEGER,
                        },
                        data: {
                                type: Sequelize.STRING,
                        },
                        createdAt: {
                                allowNull: false,
                                type: "TIMESTAMP",
                                defaultValue:
                                        Sequelize.literal("CURRENT_TIMESTAMP"),
                        },
                        updatedAt: {
                                allowNull: false,
                                type: "TIMESTAMP",
                                defaultValue:
                                        Sequelize.literal("CURRENT_TIMESTAMP"),
                        },
                });
        },
        async down(queryInterface, Sequelize) {
                await queryInterface.dropTable("new_history_edits");
        },
};
