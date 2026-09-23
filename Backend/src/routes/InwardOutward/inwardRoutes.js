const express = require("express");
const {
  getSendersDropdown,
  getSubTypesDropdown,
  getLetterTypeDropdown,
  getOutwardtypeDropdown,
  getMarathiDepartmentDropdown,
  aoio_inward_ins,
  insertInwardDocuments,
  getInwardDetailsList,
} = require("../../controllers/InwardOutward/inwardController");
const { validate } = require("../../validators/validate");
const {
  aoioInwardInsSchema,
} = require("../../validators/schemas/inwardInsSchema");

const router = express.Router();

router.post("/getSendersDropdown", getSendersDropdown);
router.post("/getSubTypesDropdown", getSubTypesDropdown);
router.get("/getLetterTypeDropdown", getLetterTypeDropdown);
router.get("/getOutTypeDropdown", getOutwardtypeDropdown);
router.post("/getMarathiDepartmentDropdown", getMarathiDepartmentDropdown);
router.post("/getDesigDropdown", getMarathiDepartmentDropdown);
router.post("/aoio_inward_ins", validate(aoioInwardInsSchema), aoio_inward_ins);
router.post("/insertInwardDocuments", insertInwardDocuments);
router.post("/getInwardDetailsList", getInwardDetailsList);

module.exports = router;
