import express, {Router} from "express";
const router : Router = express.Router();
import api from "./api";

// API
router.use('/api', api);

export default router;
