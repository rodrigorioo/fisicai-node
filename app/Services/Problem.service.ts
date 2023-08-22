import {DataObj, ProblemSolver} from "../Models/ProblemSolver";
import {Request, Response} from "express";
import {Operations} from "../Models/Topics/Topic";
import {ProblemModel} from "../Models/Problem.model";
import {OkPacket} from "mysql";

interface IResolution {
    requested : Array<keyof Operations>,
    data : Array<DataObj>,
}

class ProblemService {

    /**
     * Solve the problem and response with data, requested data and resolution
     * @param req
     * @param res
     */
    solve (req: Request, res: Response) {

        const problem: string = req.query.problem || req.body.problem;
        const resolution: IResolution = req.query.resolution || req.body.resolution;

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
            const problemSolver = new ProblemSolver(problem, resolution.requested);
            problemSolver.addData(resolution.data);

            // Solve the problem
            let problemSolved;

            try {
                problemSolved = problemSolver.resolveProblem();
            } catch (errResolveProblem: unknown) {

                const message: string = (errResolveProblem instanceof Error) ? errResolveProblem.message : "Error in solve problem";

                res.status(500).send({
                    message: message,
                });
                return;
            }

            res.json(problemSolved);

            return;

        } else if (problem) {

            // Init class
            const problemSolver = new ProblemSolver(problem);

            // Solve the problem
            problemSolver.processProblem().then((problemSolved) => {

                // Load problem to database
                ProblemModel.create({
                    user_id: req.userId,
                    problem,
                    processed_data: JSON.stringify(problemSolved),
                }).then( (problemModel: OkPacket) => {

                    const problemId = problemModel.insertId;

                    res.json(problemSolved);

                });

            }).catch((err) => {

                res.status(500).send({
                    message: `Solve problem error: ${err.message}`,
                });
            });

            return;
        }

        res.status(422).send({
            message: 'Problem or resolution parameter needed',
        });
    }

    /**
     * Return all problems of the auth user
     * @param req
     * @param res
     */
    get (req: Request, res: Response) {

        ProblemModel.get({
            user_id: req.userId
        })
            .then( (problems) => {

            res.json(problems);

        }).catch( (err) => {
            res.status(500).send({
                message: err.message,
            });
        });


    }
}

export const problemService = new ProblemService();
