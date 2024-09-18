import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import _ from "lodash";
import { User } from "../models/user";

export interface AuthDto {
    email: string;
    password: string;
}

const router = express.Router();

router.post("/", async (req, resp) => {
    const payload = req.body as AuthDto;

    const { error } = validate(payload);
    if (error)
        return resp.status(400).send({ error: error.details[0].message });

    const user = await User.findOne({ email: payload.email });
    if (!user)
        return resp.status(400).send({ error: "invalid email or password" });

    const validatedPwd = await bcrypt.compare(payload.password, user.password);
    if (!validatedPwd)
        return resp.status(400).send({ error: "invalid email or password" });

    const token = user.generateAuthToken();

    return resp.status(200).send({
        accessToken: token,
        user: _.omit(user.toObject(), ["__v", "password"]),
    });
});

function validate(user: AuthDto) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(user);
}

export default router;
