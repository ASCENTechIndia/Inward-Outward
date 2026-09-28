const express = require("express");
const {
  senderMasterList,
  getSenderTypeDropdown,
  getSenderSubTypeList,
  aoio_sender_ins,
  getSenderDetail,
  aoio_sendersubtype_ins,
  getReceiverCategoryList,
  gerPurposeMasterList,
  gerPurposeMasterDetails,
  aoio_purpose_ins,
  getDocTypeList,
  getDocTypeDetails,
  aoio_doctype_ins,
  getInwardModeList,
  getInwardDetails,
  aoio_inwardmodemas_ins,
  getOurwardList,
  getOutwardDetails,
  aoio_outwardmode_ins,
  getReciverCategoryDropdown,
  getReceiverSubCategoryList,
  aoio_receiversubcategory_ins,
  getDocumentTypeDropdown,
  getDocumentSubTypeList,
  aoio_receivercategory_ins,
  getReceiverDetails,
  aoio_docsubtype_ins,
} = require("../../controllers/InwardOutward/masterController");
const { validate } = require("../../validators/validate");
const {
  senderInsSchema,
  senderSubtypeInsSchema,
  purposeInsSchema,
  docTypeInsSchema,
  inwardModeInsSchema,
  outwardModeInsSchema,
  receiverSubCatInsSchema,
  receiverCategoryInsSchema,
  docSubtypeInsSchema,
} = require("../../validators/schemas/masterSchema");

const router = express.Router();

// Sender
router.get("/getSenderMasterList", senderMasterList);
router.post("/aoio_sender_ins", validate(senderInsSchema), aoio_sender_ins);
router.post("/getSenderDetail", getSenderDetail);

// Sender Sub Type
router.get("/getSenderTypeDropdown", getSenderTypeDropdown);
router.post("/getSenderSubTypeList", getSenderSubTypeList);
router.post(
  "/aoio_sendersubtype_ins",
  validate(senderSubtypeInsSchema),
  aoio_sendersubtype_ins,
);

// Receiver category list
router.get("/getReceiverCategoryList", getReceiverCategoryList);
router.post("/getReceiverDetails", getReceiverDetails);
router.post(
  "/aoio_receivercategory_ins",
  validate(receiverCategoryInsSchema),
  aoio_receivercategory_ins,
);

// Purpose master
router.get("/gerPurposeMasterList", gerPurposeMasterList);
router.post("/gerPurposeMasterDetails", gerPurposeMasterDetails);
router.post("/aoio_purpose_ins", validate(purposeInsSchema), aoio_purpose_ins);

// Document Type master
router.get("/getDocTypeList", getDocTypeList);
router.post("/getDodTypeDetails", getDocTypeDetails);
router.post("/aoio_doctype_ins", validate(docTypeInsSchema), aoio_doctype_ins);

// Inward mode master
router.get("/getInwardModeList", getInwardModeList);
router.post("/getInwardDetails", getInwardDetails);
router.post(
  "/aoio_inwardmodemas_ins",
  validate(inwardModeInsSchema),
  aoio_inwardmodemas_ins,
);

// Outward mode list
router.get("/getOurwardList", getOurwardList);
router.post("/getOutwardDetails", getOutwardDetails);
router.post(
  "/aoio_outwardmode_ins",
  validate(outwardModeInsSchema),
  aoio_outwardmode_ins,
);

// Receive Sub Category
router.get("/getReciverCategoryDropdown", getReciverCategoryDropdown);
router.post("/getReceiverSubCategoryList", getReceiverSubCategoryList);
router.post(
  "/aoio_receiversubcategory_ins",
  validate(receiverSubCatInsSchema),
  aoio_receiversubcategory_ins,
);

// Document Sub Type
router.get("/getDocumentTypeDropdown", getDocumentTypeDropdown);
router.post("/getDocumentSubTypeList", getDocumentSubTypeList);
router.post(
  "/aoio_docsubtype_ins",
  validate(docSubtypeInsSchema),
  aoio_docsubtype_ins,
);

module.exports = router;
