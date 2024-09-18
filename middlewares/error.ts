import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../types/authenticatedRequest";
import logger from "../utils/logger";

export function error(
    err: Error,
    req: Request | AuthenticatedRequest,
    resp: Response,
    next: NextFunction
) {
    logger.error(err.message, err);
    resp.status(500).send("Something went wrong.");
}
