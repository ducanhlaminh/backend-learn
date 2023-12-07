const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("zing_new", "root", null, {
      host: "localhost",
      dialect: "mysql",
      logging: false,
});

const connectDB = async () => {
      try {
            await sequelize.authenticate();
            console.log("Connection to database successfully.");
      } catch (error) {
            console.error("Unable to connect to the database:", error);
      }
};
connectDB();
