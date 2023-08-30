import {Request, Response} from "express";
import {UserService} from "../Services/User.service";

export default {

    /**
     *
     * @param req
     * @param res
     */
    login (req: Request, res: Response) {

        // Get data from request
        const email: string =  req.body.email || req.query.email;
        const password: string = req.body.password || req.query.password;

        // Init service
        const userService = new UserService();

        // Login
        userService.login(email, password).then( (dataLogin) => {
            res.status(200).send(dataLogin);
        }).catch( (err) => {
            res.status(err.code).send({
                message: err.message,
            });
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    register (req: Request, res: Response) {

        // Get data from request
        const email: string =  req.body.email || req.query.email;
        const password: string = req.body.password || req.query.password;

        // Init service
        const userService = new UserService();

        // Login
        userService.register(email, password).then( (dataRegister) => {
            res.status(200).send(dataRegister);
        }).catch( (err) => {
            res.status(err.code).send({
                message: err.message,
            });
        });
    },

    checkAuth (req: Request, res: Response) {

        // Init service
        const userService = new UserService();

        // Check auth
        userService.checkAuth(req.userId).then( (dataLogin) => {
            res.json(dataLogin);
        }).catch( (err) => {
            res.status(err.code).send({
                message: err.message,
            });
        });
    }
}
