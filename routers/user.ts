import express from "express";
import _ from "lodash";
import bcrypt from "bcrypt";
import { User, validateUser as validate } from "../models/user";
import { CreateUserDto } from "../types/dtos/createUser";
import { auth } from "../middlewares/auth";
import AuthenticatedRequest from "../types/authenticatedRequest";
import { DecodeUserDto } from "../types/dtos/decodedUser";

const router = express.Router();

router.get("/me", auth, async (req: AuthenticatedRequest, resp) => {
    const payload = req.user as DecodeUserDto;

    const user = await User.findById(payload._id).select(["-password", "-__v"]);

    return resp.status(200).send({ user: user });
});

router.post("/", async (req, resp) => {
    const data = req.body as CreateUserDto;

    const { error } = validate(data);
    if (error)
        return resp.status(400).send({ error: error.details[0].message });

    let user = await User.findOne({ email: data.email });

    if (user)
        return resp
            .status(409)
            .send({ error: "This email has already been used" });

    user = new User(_.pick(req.body, ["fullname", "email", "password"]));

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    return resp.status(201).send({
        detail: "user successfully created",
        user: _.omit(user.toObject(), ["__v", "password"]),
    });
});

router.delete("/", auth, async (req: AuthenticatedRequest, resp) => {
    const user = await User.findByIdAndDelete(req.user);

    await user!.save();

    return resp.status(200).send({
        detail: "account has been successfully deleted",
    });
});

export default router;
