"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
      async up(queryInterface, Sequelize) {
            await queryInterface.createTable("new_articles", {
                  id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                  },
                  title: {
                        type: Sequelize.STRING,
                  },
                  slug: {
                        type: Sequelize.STRING,
                  },
                  slug_crc: {
                        type: Sequelize.INTEGER,
                  },
                  content: {
                        type: Sequelize.STRING,
                  },
                  sapo: {
                        type: Sequelize.STRING,
                  },
                  avatar: {
                        type: Sequelize.STRING,
                  },
                  status: {
                        type: Sequelize.INTEGER,
                        defaultValue: 0,
                  },
                  created_user_id: {
                        type: Sequelize.INTEGER,
                  },
                  views: {
                        type: Sequelize.INTEGER,
                        defaultValue: 0,
                  },
                  publishAt: {
                        type: Sequelize.DATE,
                        allowNull: true, // Allow null values
                        defaultValue: null, // Set default value to null
                  },
                  updated_user_id: {
                        type: Sequelize.INTEGER,
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
            await queryInterface.dropTable("new_articles");
      },
};
