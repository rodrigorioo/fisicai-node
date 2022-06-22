const express = require('express');
const router = express.Router();

// Controllers
const Controller = require('../controllers/APIController')

// About page route.
router.post('/solve-problem', Controller.solveProblem);

module.exports = router;
