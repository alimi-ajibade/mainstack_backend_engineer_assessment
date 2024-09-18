import { Model } from "mongoose";

export interface ICategory {
    title: string;
}

export type CategoryModel = Model<ICategory>;
