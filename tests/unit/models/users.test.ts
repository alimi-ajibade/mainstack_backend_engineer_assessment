import { User } from "../../../models/user";
import jwt from "jsonwebtoken";
import config from "config";
import mongoose from "mongoose";

describe("User.generateAuthToken", () => {
    test("should return a valid JWT token", () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
        };

        const user = new User(payload);
        const token = user.generateAuthToken();

        const result = jwt.verify(
            token,
            config.get<string>("jwtPrivateKey")
        ) as {
            _id: string;
        };

        expect(result).toMatchObject(payload);
    });
});
