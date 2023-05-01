"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
        async up(queryInterface, Sequelize) {
                await queryInterface.createTable("new_articles_categories", {
                        id: {
                                allowNull: false,
                                autoIncrement: true,
                                primaryKey: true,
                                type: Sequelize.INTEGER,
                        },
                        article_id: {
                                type: Sequelize.INTEGER,
                        },
                        category_id: {
                                type: Sequelize.INTEGER,
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
                await queryInterface.dropTable("new_articles_categories");
        },
};
