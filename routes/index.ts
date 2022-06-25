import express, {Router} from "express";
const router : Router = express.Router();

// API
router.use('/api', require('./api'));

module.exports = router;
