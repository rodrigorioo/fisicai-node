import express, {Router} from "express";
const router : Router = express.Router();

// Controllers
import APIController from "../Controllers/APIController";

// Solve problem
router.post('/solve-problem', APIController.solveProblem);
router.post('/login', APIController.login);
router.post('/register', APIController.register);

export default router;
