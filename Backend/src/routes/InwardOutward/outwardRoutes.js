const express = require("express");
const { validate } = require("../../validators/validate");
const {
  getMainReceiverCategoryDropdown,
  receiverSubCategoryDropdown,
  getDocumentTypeDropdown,
  getDocumentSubTypeDropdown,
  getOutwardTypeDropdown,
  getDepartmentDropdown,
  getPrabhagDropdown,
  getCcDepartmentDropdown,
  getCcPurposeDropdown,
  getCcDesignationDropdown,
  getEmployeeNameDropdown,
  getInwardDetailByRefNo,
  aoio_outward_ins,
} = require("../../controllers/InwardOutward/outwardController");
const { outwardInsSchema } = require("../../validators/schemas/outWardSchema");

const router = express.Router();

// Outward register
router.post(
  "/getMainReceiverCategoryDropdown",
  getMainReceiverCategoryDropdown,
);
router.post("/receiverSubCategoryDropdown", receiverSubCategoryDropdown);
router.get("/getDocumentTypeDropdown", getDocumentTypeDropdown);
router.get("/getDocumentSubTypeDropdown", getDocumentSubTypeDropdown);
router.get("/getOutwardTypeDropdown", getOutwardTypeDropdown);
router.post("/getDepartmentDropdown", getDepartmentDropdown);
router.post("/getPrabhagDropdown", getPrabhagDropdown);
router.post("/getCcDepartmentDropdown", getCcDepartmentDropdown);
router.get("/getCcPurposeDropdown", getCcPurposeDropdown);
router.post("/getCcDesignationDropdown", getCcDesignationDropdown);
router.post("/getEmployeeNameDropdown", getEmployeeNameDropdown);
router.post("/getInwardDetailByRefNo", getInwardDetailByRefNo);
router.post("/aoio_outward_ins", validate(outwardInsSchema), aoio_outward_ins);

module.exports = router;
