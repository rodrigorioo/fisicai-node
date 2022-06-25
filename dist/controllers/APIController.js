"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProblemSolver_1 = require("../app/ProblemSolver");
const solveProblem = (req, res) => {
    const problem = req.query.problem || req.body.problem;
    const resolution = req.query.resolution || req.body.resolution;
    if (resolution) {
        // Valid if keys exists in object
        if (!("requested" in resolution) || !("data" in resolution)) {
            res.status(500).send({
                message: "Parameter resolution is not completed",
            });
            return;
        }
        // Valid if are array
        if (!Array.isArray(resolution.requested) || !Array.isArray(resolution.data)) {
            res.status(500).send({
                message: "Some of the keys of resolution are not array",
            });
            return;
        }
        // Init class
        const problemSolver = new ProblemSolver_1.ProblemSolver(problem, resolution.requested);
        problemSolver.addData(resolution.data);
        // Solve the problem
        let problemSolved;
        try {
            problemSolved = problemSolver.resolveProblem();
        }
        catch (errResolveProblem) {
            const message = (errResolveProblem instanceof Error) ? errResolveProblem.message : "Error in solve problem";
            res.status(500).send({
                message: message,
            });
            return;
        }
        res.json(problemSolved);
        return;
    }
    else if (problem) {
        // Init class
        const problemSolver = new ProblemSolver_1.ProblemSolver(problem);
        // Solve the problem
        problemSolver.processProblem().then((problemSolved) => {
            res.json(problemSolved);
        }).catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
        return;
    }
    res.status(422).send({
        message: 'Problem or resolution parameter needed',
    });
};
const APIController = {
    solveProblem,
};
exports.default = APIController;
