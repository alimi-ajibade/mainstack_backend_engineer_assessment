import winston from "winston";

export default winston.createLogger({
    exceptionHandlers: [
        new winston.transports.File({
            filename: "exceptions.log",
            level: "error",
        }),
        new winston.transports.Console({
            level: "error",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: "rejections.log",
            level: "error",
        }),
        new winston.transports.Console({
            level: "error",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
    exitOnError: false,
});
