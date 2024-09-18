import uncaughtErrorLogger from "../utils/uncaughtErrorHandler";

export default function () {
    // handles uncaught exceptions and promise rejections
    process.on("uncaughtException", (ex) => {
        console.log("WE GOT AN UNCAUGHT EXCEPTION");
        uncaughtErrorLogger.error(ex.message, ex);
        if (ex.name !== "MongoError") {
            process.exit(1);
        }
    });

    process.on("unhandledRejection", (ex: Error) => {
        console.log("WE GOT AN UNHANDLED PROMISE REJECTION");
        uncaughtErrorLogger.error(ex.message, ex);
        if (ex.name !== "MongoError") {
            process.exit(1);
        }
    });
}
