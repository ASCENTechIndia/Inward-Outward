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
  getInwarListTwo,
  getInwarListThree,
  AOIO_INWARD_docUpdt,
  updateInwardDocumentBlobs,
  getInwarDocUploadList,
  getExistingDocList,
  getTransferFormData,
  getForwardTransferData,
  aoio_transfer_ins,
} = require("../../controllers/InwardOutward/inwardController");
const { validate } = require("../../validators/validate");
const {
  aoioInwardInsSchema,
  inwardDocUpdtSchema,
  updateInwardDocumentBlobsSchema,
  inwardTransferInsSchema,
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
router.post("/getInwarListTwo", getInwarListTwo);
router.post("/getInwarDocUploadList", getInwarDocUploadList);
router.post("/getExistingDocList", getExistingDocList);
router.post(
  "/AOIO_INWARD_docUpdt",
  validate(inwardDocUpdtSchema),
  AOIO_INWARD_docUpdt,
);
router.post(
  "/updateInwardDocumentBlobs",
  validate(updateInwardDocumentBlobsSchema),
  updateInwardDocumentBlobs,
);
router.post("/getInwarListThree", getInwarListThree);
router.post("/getTransferFormData", getTransferFormData);
router.post("/getForwardTransferData", getForwardTransferData);
router.post(
  "/aoio_transfer_ins",
  validate(inwardTransferInsSchema),
  aoio_transfer_ins,
);

module.exports = router;
