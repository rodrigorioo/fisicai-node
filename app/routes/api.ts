import express, {Router} from "express";
const router : Router = express.Router();
import {AuthJWT} from "../Middlewares/AuthJWT";

// Controllers
import ProblemController from "../Controllers/ProblemController";
import UserController from "../Controllers/UserController";

// Problems
router.post(
    '/solve-problem',
    [AuthJWT.verifyToken],
    ProblemController.solve
);
router.get(
    '/problems',
    [AuthJWT.verifyToken],
    ProblemController.get
);

// User
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get(
    '/auth',
    [AuthJWT.verifyToken],
    UserController.checkAuth
);

export default router;
