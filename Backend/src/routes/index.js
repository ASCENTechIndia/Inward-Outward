const express = require("express");
const router = express.Router();

const authRoutes = require("./Admin/authRoutes");
router.use("/", authRoutes);

const logoroutes = require("./Admin/logoroutes");
router.use("/", logoroutes);

const logoutRoutes = require("./Admin/logoutRoutes.js");
router.use("/", logoutRoutes);

const menurouted = require("./Admin/menuRoutes.js");
router.use("/", menurouted);

// Inward Outward all pages routes
const masterRoutes = require("./InwardOutward/masterRoutes.js");
router.use("/", masterRoutes);

const configRoutes = require("./InwardOutward/configRoutes.js");
router.use("/", configRoutes);

const outwardRoutes = require("./InwardOutward/outwardRoutes.js");
router.use("/", outwardRoutes);

const inwardRoutes = require("./InwardOutward/inwardRoutes.js");
router.use("/", inwardRoutes);

const reportRoutes = require("./InwardOutward/reportRoutes.js");
router.use("/", reportRoutes);

module.exports = router;
