import express, {Router} from "express";
const router : Router = express.Router();
import {AuthJWT} from "../Middlewares/AuthJWT";

// Controllers
import APIController from "../Controllers/APIController";

// Problems
router.post(
    '/solve-problem',
    [AuthJWT.verifyToken],
    APIController.solveProblem
);
router.get(
    '/problems',
    [AuthJWT.verifyToken],
    APIController.getProblems
);

// User
router.post('/login', APIController.login);
router.post('/register', APIController.register);
router.get(
    '/auth',
    [AuthJWT.verifyToken],
    APIController.auth
);

export default router;
