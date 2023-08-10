import {userService} from "../Services/User.service";
import {problemService} from "../Services/Problem.service";

const APIController = {
    solveProblem: problemService.solve,

    login: userService.login,
    register: userService.register,
    auth: userService.checkAuth,
};

export default APIController;
