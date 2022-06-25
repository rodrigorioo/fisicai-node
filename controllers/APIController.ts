import express, { Express, Request, Response } from 'express';

import {DataObj, ProblemSolver} from "../app/ProblemSolver";
import {Operations} from "../app/Topics/Topic";

interface IResolution {
    requested : Array<keyof Operations>,
    data : Array<DataObj>,
}

exports.solveProblem = (req : Request, res : Response) => {

    const problem : string = req.query.problem || req.body.problem;
    const resolution : IResolution = req.query.resolution || req.body.resolution;

    if (resolution) {

        // Valid if keys exists in object
        if (!("requested" in resolution) || !("data" in resolution)) {
            res.status(500).send({
                message: "Parameter resolution is not completed",
            });
            return;
        }

        // Valid if are array
        if(!Array.isArray(resolution.requested) || !Array.isArray(resolution.data)) {
            res.status(500).send({
                message: "Some of the keys of resolution are not array",
            });
            return;
        }

        // Init class
        const problemSolver = new ProblemSolver(problem, resolution.requested);
        problemSolver.addData(resolution.data);

        // Solve the problem
        let problemSolved;

        try {
            problemSolved = problemSolver.resolveProblem();
        } catch (errResolveProblem : unknown) {

            const message : string = (errResolveProblem instanceof Error) ? errResolveProblem.message : "Error in solve problem";

            res.status(500).send({
                message: message,
            });
            return;
        }

        res.json(problemSolved);

        return;

    } else if(problem) {

        // Init class
        const problemSolver = new ProblemSolver(problem);

        // Solve the problem
        problemSolver.processProblem().then( (problemSolved) => {

            res.json(problemSolved);

        }).catch( (err) => {

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
