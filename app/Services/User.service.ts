import {UserModel, UserInterface} from "../Models/User.model";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";
import {Request, Response} from "express";
import {authConfig} from "../config/auth.config";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {

    /**
     *
     * @param req
     * @param res
     */
    login (req : Request, res : Response) {

        // Get data from request
        const email: string =  req.body.email || req.query.email;
        const password: string = req.body.password || req.query.password;

        // Get user
        UserModel.findBy('email', email).then( (user ) => {

            // If the user was founded, verify password
            const passwordIsValid = bcrypt.compareSync(
                password,
                (user as UserInterface).password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Invalid Password!"
                });
            }

            // Create access token
            const token = jwt.sign(
                {
                    id: (user as UserInterface).id
                },
                authConfig.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 2628003, // 1 month
                });

            res.status(200).send({
                id: (user as UserInterface).id,
                email: (user as UserInterface).email,
                accessToken: token,
            });

        }).catch( (err) => {

            res.status(err.getCode()).send({
                message: err.message,
            });

        });
    }

    /**
     *
     * @param req
     * @param res
     */
    register (req : Request, res : Response) {

        // Get data from request
        const email: string =  req.body.email || req.query.email;
        const password: string = req.body.password || req.query.password;

        // Get user
        UserModel.findBy('email', email).then( (user) => {

            res.status(409).send({
                message: 'Usuario existe',
            });

        }).catch( (e) => {

            // Si el usuario no existe
            if(e instanceof NotFoundException) {
                UserModel.create({
                    email,
                    password: bcrypt.hashSync(password, 8),
                }).then( (user) => {

                    res.status(200).send({
                        message: 'Usuario creado con éxito',
                    });

                }).catch( (err) => {

                    res.status(err.getCode()).send({
                        message: err.message,
                    });

                });

            } else {
                res.status(e.getCode()).send({
                    message: 'Error al consultar el usuario',
                });
            }
        });
    }

    checkAuth (req : Request, res : Response) {

        // Get user
        UserModel.findById(req.userId).then( (user) => {

            res.json({
                email: (user as UserInterface).email,
            });

        }).catch( (err) => {

            res.status(err.getCode()).send({
                message: err.message,
            });
        });
    }
}

export const userService = new UserService();
