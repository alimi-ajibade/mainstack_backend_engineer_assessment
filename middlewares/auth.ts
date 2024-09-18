import jwt from "jsonwebtoken";
import config from "config";
import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../types/authenticatedRequest";

export function auth(
    req: AuthenticatedRequest,
    resp: Response,
    next: NextFunction
) {
    const token = req.header("x-auth-token");

    if (!token)
        return resp
            .status(401)
            .send({ error: "ACCESS DENIED: No token provided" });

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch {
        resp.status(400).send({ error: "invalid token" });
    }
}
