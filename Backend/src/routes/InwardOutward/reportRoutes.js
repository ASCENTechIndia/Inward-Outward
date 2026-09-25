const express = require("express");
const {
  getEmpDropdown,
  getInwardRegisterReport,
} = require("../../controllers/InwardOutward/reportController");

const router = express.Router();

router.post("/getEmpDropdown", getEmpDropdown);
router.post("/getInwardRegisterReport", getInwardRegisterReport);

module.exports = router;
