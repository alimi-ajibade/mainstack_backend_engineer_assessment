import config from "config";
import morgan from "morgan";
import { Express } from "express";
import logger from "../utils/logger";

export default function (app: Express) {
    // checks if the required environment varaibles have been set
    if (!config.get("jwtPrivateKey")) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
    }

    app.use(morgan("dev"));
    logger.info("Morgan enabled...");
}
