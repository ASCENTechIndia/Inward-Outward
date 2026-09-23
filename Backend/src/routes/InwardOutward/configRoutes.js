const express = require("express");
const {
  getUlbDropdown,
  getSenderTypeDropdown,
  getSenderSubTypeConfigTableData,
  aoio_sendersubtypeconfig_ins,
  getSenderTypeConfigTableData,
  getSenderTypeConfigSelectedIds,
  aoio_sendertypeconfig_ins,
  getSenderSubTypeConfigSelectedIds,
  getUserDropdown,
  getUserDeptConfigTableData,
  getUserDeptConfigSelectedIds,
  aoio_OutwardUserConfig_ins,
} = require("../../controllers/InwardOutward/configController");
const { validate } = require("../../validators/validate");
const {
  senderSubTypeConfigSchema,
  senderTypeConfigSchema,
  userConfigSchema,
} = require("../../validators/schemas/configurationSchema");

const router = express.Router();

// Sender subtype config
router.get("/getUlbDropdown", getUlbDropdown);
router.post("/getSenderTypeDropdown", getSenderTypeDropdown);
router.post(
  "/getSenderSubTypeConfigTableData",
  getSenderSubTypeConfigTableData,
);
router.post(
  "/getSenderSubTypeConfigSelectedIds",
  getSenderSubTypeConfigSelectedIds, // this api query is not 100% correct
);
router.post(
  "/aoio_sendersubtypeconfig_ins",
  validate(senderSubTypeConfigSchema),
  aoio_sendersubtypeconfig_ins,
);

// Sender type config
router.get("/getSenderTypeConfigTableData", getSenderTypeConfigTableData);
router.post("/getSenderTypeConfigSelectedIds", getSenderTypeConfigSelectedIds);
router.post(
  "/aoio_sendertypeconfig_ins",
  validate(senderTypeConfigSchema),
  aoio_sendertypeconfig_ins,
);

// Userwise department config
router.post("/getUserDropdown", getUserDropdown);
router.post("/getUserDeptConfigTableData", getUserDeptConfigTableData);
router.post("/getUserDeptConfigSelectedIds", getUserDeptConfigSelectedIds);
router.post(
  "/aoio_OutwardUserConfig_ins",
  validate(userConfigSchema),
  aoio_OutwardUserConfig_ins,
);

// Outward

module.exports = router;
