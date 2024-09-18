import { ICategory } from "./category";
import { Model } from "mongoose";

export interface IProduct {
    title: string;
    slug: string;
    description: string;
    unit_price: number;
    inventory: number;
    category: ICategory;
}

export type ProductModel = Model<IProduct>;
