const express = require('express');
const router = express.Router();
const { receiveData } = require('../controllers/webhookController');

// POST /api/receive
router.post('/', receiveData);

module.exports = router;
