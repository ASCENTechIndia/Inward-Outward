const express = require("express");
const {
  getDashboardAllDepartmentList,
  getDashboardSummaryCounts,
} = require("../../controllers/InwardOutward/dashboardController");

const router = express.Router();

router.get("/getDashboardAllDepartmentList", getDashboardAllDepartmentList);
router.post("/getDashboardSummaryCounts", getDashboardSummaryCounts);

module.exports = router;
