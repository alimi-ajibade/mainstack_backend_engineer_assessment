import express, { Express } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import fileUpload from "express-fileupload";

export default function (app: Express) {
    app.use(
        cors({
            methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
            exposedHeaders: ["x-auth-token"],
        })
    );
    app.use(helmet());
    // app.use(fileUpload());
    app.use(compression());
    app.use(express.json());
}
