import {Request, Response } from 'express';

import {DataObj, ProblemSolver} from "../Models/ProblemSolver";
import {Operations} from "../Models/Topics/Topic";
import {UserModel} from "../Models/User.model";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";
import {authConfig} from "../config/auth.config";

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

interface IResolution {
    requested : Array<keyof Operations>,
    data : Array<DataObj>,
}

const solveProblem = (req : Request, res : Response) => {

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
}

const register = (req : Request, res : Response) => {

    // Get data from request
    const email: string =  req.body.email || req.query.email;
    const password: string = req.body.password || req.query.password;

    // Get user
    const user = new UserModel(email, password);

    user.findBy('email', email).then( (user) => {

        res.status(422).send({
            message: 'Usuario existe',
        });

    }).catch( (e) => {

        // Si el usuario no existe
        if(e instanceof NotFoundException) {
            user.create({
                email,
                password: bcrypt.hashSync(password, 8),
            }).then( (user) => {

                res.status(200).send({
                    message: 'Usuario creado con éxito',
                });

            }).catch( (err) => {

                res.status(500).send({
                    message: err.message,
                });

            });

        } else {
            res.status(500).send({
                message: 'Error al consultar el usuario',
            });
        }
    });
}

const login = (req : Request, res : Response) => {

    // Get data from request
    const email: string =  req.body.email || req.query.email;
    const password: string = req.body.password || req.query.password;

    // Get user
    const user = new UserModel(email, password);
    user.findBy('email', email).then( (user) => {

        // If the user was founded, verify password
        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Password!"
            });
        }

        // Create access token
        const token = jwt.sign({
                id: user.id
            },
            authConfig.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 2628003, // 1 month
            });

        res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: token,
        });

    }).catch( (err) => {

        res.status(422).send({
            message: err.message,
        });

    });
}

const APIController = {
    solveProblem,
    login,
    register,
};

export default APIController;
