import { Model } from "mongoose";

export interface IUser {
    fullname: string;
    email: string;
    password: string;
}

export interface IUserMethods {
    generateAuthToken: () => string;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
