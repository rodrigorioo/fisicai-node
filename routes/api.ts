import express, {Router} from "express";
const router : Router = express.Router();

// Controllers
import APIController from "../controllers/APIController";

// About page route.
router.post('/solve-problem', APIController.solveProblem);

export default router;
