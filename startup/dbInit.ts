import config from "config";
import mongoose from "mongoose";
import logger from "../utils/logger";

export default function () {
    const db: string = config.get("db");
    return mongoose
        .connect(db)
        .then(() => logger.info("Connected to Mongodb"))
        .catch((error) =>
            logger.error("Could not connect to MongoDB...", error)
        );
}
