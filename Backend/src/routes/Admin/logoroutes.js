const express = require("express");
const {
  fetchCorporationDetails,
} = require("../../controllers/Admin/logocontroller.js");

const router = express.Router();

// Define route: GET /api/corporation/details/:ulbId
router.post("/textlogo", fetchCorporationDetails);

module.exports = router;
