import {UserModel, UserInterface} from "../Models/User.model";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";
import {authConfig} from "../config/auth.config";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export class UserService {

    /**
     *
     * @param email
     * @param password
     */
    login (email: string, password: string) {

        return new Promise( (resolve, reject) => {

            // Get user
            UserModel.findBy('email', email).then( (user ) => {

                // If the user was founded, verify password
                const passwordIsValid = bcrypt.compareSync(
                    password,
                    (user as UserInterface).password
                );

                if (!passwordIsValid) {
                    return reject({
                        code: 401,
                        message: "Invalid Password!",
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

                return resolve({
                    id: (user as UserInterface).id,
                    email: (user as UserInterface).email,
                    accessToken: token,
                });

            }).catch( (err) => {
                return reject({
                    code: err.getCode(),
                    message: err.message,
                });
            });

        });
    }

    /**
     *
     * @param email
     * @param password
     */
    register (email: string, password: string) {

        return new Promise( (resolve, reject) => {

            // Get user
            UserModel.findBy('email', email).then( (user) => {

                return reject({
                    code: 409,
                    message: 'Usuario existe',
                });

            }).catch( (e) => {

                // Si el usuario no existe
                if(e instanceof NotFoundException) {
                    UserModel.create({
                        email,
                        password: bcrypt.hashSync(password, 8),
                    }).then( (user) => {

                        return resolve({
                            message: 'Usuario creado con éxito',
                        });

                    }).catch( (err) => {

                        return reject({
                            code: e.getCode(),
                            message: err.message,
                        });

                    });

                } else {
                    return reject({
                        code: e.getCode(),
                        message: 'Error al consultar el usuario',
                    });
                }
            });

        });
    }

    checkAuth (userId: number) {

        return new Promise( (resolve, reject) => {
            // Get user
            UserModel.findById(userId).then( (user) => {

                resolve({
                    email: (user as UserInterface).email,
                });

            }).catch( (err) => {

                reject({
                    code: err.getCode(),
                    message: err.message
                });

            });
        });
    }
}
