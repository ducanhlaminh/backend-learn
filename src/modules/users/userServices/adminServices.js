const db = require("../../../config/newModels");
const dbUser = require("../../../config/userModels");
const { Op } = require("sequelize");
const crc32 = require("crc/crc32");
const fs = require("fs");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const path = require("path");
const sharp = require("sharp");

const adminServices = {};

module.exports = adminServices;
