const express = require("express");
const cors = require("cors");
const initWebRoutes = require("./src/routers/index");
require("./src/config/connectDB");
require("dotenv").config();

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "DELETE", "PUT"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initWebRoutes(app);
const PORT = process.env.PORT || 8888;
const listen = app.listen(PORT, () => {
    console.log("Server is running in post " + listen.address().port);
});
