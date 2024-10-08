import winston from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: "logfile.log",
            level: "error",
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

export default logger;
