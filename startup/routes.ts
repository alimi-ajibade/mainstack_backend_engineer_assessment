import "express-async-errors";
import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import users from "../routers/user";
import auth from "../routers/auth";
import category from "../routers/category";
import product from "../routers/product";
import specs from "./doc";
import { error } from "../middlewares/error";

export default function (app: Express) {
    app.use(express.json());
    app.use(express.static("public"));
    app.use("/api/v1/users", users);
    app.use("/api/v1/auth", auth);
    app.use("/api/v1/categories", category);
    app.use("/api/v1/products", product);
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, undefined, {
            persistAuthorization: true,
        })
    );
    app.use(error);
}
