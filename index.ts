import express from "express";
import _ from "lodash";
import { createServer } from "http";
import dbInit from "./startup/dbInit";
import middlewareStartup from "./startup/middlewares";
import configStartup from "./startup/config";
import routerStartup from "./startup/routes";
import unhandledErrorLogger from "./startup/unhandledErrorLogger";
import logger from "./utils/logger";

const app = express();

// startup
dbInit();
middlewareStartup(app);
configStartup(app);
routerStartup(app);
unhandledErrorLogger();

// http server
const httpServer = createServer(app);

httpServer.listen(process.env.PORT || 8000, () =>
    logger.info(`Listening on port ${app.get("PORT") || 8000}...`)
);
