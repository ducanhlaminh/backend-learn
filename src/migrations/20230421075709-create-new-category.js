"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
        async up(queryInterface, Sequelize) {
                await queryInterface.createTable("new_categories", {
                        id: {
                                allowNull: false,
                                autoIncrement: true,
                                primaryKey: true,
                                type: Sequelize.INTEGER,
                        },
                        name: {
                                type: Sequelize.STRING,
                        },
                        slug: {
                                type: Sequelize.STRING,
                        },
                        slug_src: {
                                type: Sequelize.INTEGER,
                        },
                        parent_id: {
                                type: Sequelize.INTEGER,
                        },
                        updated_user_id: {
                                type: Sequelize.INTEGER,
                        },
                        created_user_id: {
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
                await queryInterface.dropTable("new_categories");
        },
};
