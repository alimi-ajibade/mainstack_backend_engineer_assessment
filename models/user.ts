import mongoose from "mongoose";
import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import config from "config";
import jwt from "jsonwebtoken";
import { IUser, IUserMethods, UserModel } from "../types/user";
import { CreateUserDto } from "../types/dtos/createUser";

const joiPassword = Joi.extend(joiPasswordExtendCore);

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
    {
        fullname: {
            type: String,
            minlength: 5,
            maxlength: 255,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            minlength: 5,
            maxlength: 255,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: 5,
            maxlength: 1024, // hashed value
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.method("generateAuthToken", function () {
    const secret: string = config.get("jwtPrivateKey");
    const token: string = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
        },
        secret,
        {
            expiresIn: "1day",
        }
    );

    return token;
});

export const User = mongoose.model<IUser, UserModel>("User", userSchema);

export function validateUser(user: CreateUserDto) {
    const schema = Joi.object({
        fullname: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .required(),
    });

    return schema.validate(user);
}
