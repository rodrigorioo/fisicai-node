const express = require('express');
const router = express.Router();

// API
router.use('/api', require('./api'));

module.exports = router;
