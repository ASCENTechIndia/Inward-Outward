const express = require("express");
const {
  getEmpDropdown,
  getInwardRegisterReport,
  getFileMovementTrackingList,
  getFileMovementTrackingPopupList,
  getInwardNoClickList,
  getTransferDetailsReport,
} = require("../../controllers/InwardOutward/reportController");

const router = express.Router();

router.post("/getEmpDropdown", getEmpDropdown);
router.post("/getInwardRegisterReport", getInwardRegisterReport);

router.post("/getFileMovementTrackingList", getFileMovementTrackingList);
router.post(
  "/getFileMovementTrackingPopupList",
  getFileMovementTrackingPopupList,
);
router.post("/getInwardNoClickList", getInwardNoClickList);
router.post("/getTransferDetailsReport", getTransferDetailsReport);

module.exports = router;
