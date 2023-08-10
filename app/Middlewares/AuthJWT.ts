import {authConfig} from "../config/auth.config";
import {Request, Response, NextFunction} from "express";
import {JsonWebTokenError, JwtPayload, VerifyErrors, VerifyOptions} from "jsonwebtoken";

const jwt = require("jsonwebtoken");

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(
        token as string,
        authConfig.secret,
        (jwt: JsonWebTokenError, decoded: JwtPayload) => {

            if(jwt) {
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }

            req.userId = decoded.id;
            next();
        }
    );
};

export const AuthJWT = {
    verifyToken: verifyToken,
};
