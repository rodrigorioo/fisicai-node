import express, {Router} from "express";
const router : Router = express.Router();

// Controllers
const Controller = require('../controllers/APIController')

// About page route.
router.post('/solve-problem', Controller.solveProblem);

module.exports = router;
