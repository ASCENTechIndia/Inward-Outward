const express = require('express');
const router = express.Router();
const { getMenus } = require('../../../src/controllers/Admin/menuController');

router.post('/inventoryMenus', getMenus);

module.exports = router;