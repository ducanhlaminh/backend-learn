const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("zing_new-test", "root", null, {
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

// const Sequelize = require("sequelize");
// const mariadb = require("mariadb");

// const sequelize = new Sequelize("database_zing", "root", null, {
//       dialect: "mariadb",
//       host: "localhost",
//       pool: {
//             max: 5,
//             min: 0,
//             idle: 10000,
//       },
//       logging: false,
// });

// sequelize
//       .authenticate()
//       .then(() => {
//             console.log("Connected to MariaDB!");
//       })
//       .catch((err) => {
//             console.log("Error connecting to MariaDB: " + err);
//       });
