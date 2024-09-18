import mongoose from "mongoose";
import Joi from "joi";
import { CategoryModel, ICategory } from "../types/category";
import { ICreateCategoryDto } from "../types/dtos/createCategoryDto";

export const categorySchema = new mongoose.Schema<ICategory, CategoryModel>(
    {
        title: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
            lowercase: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model<ICategory, CategoryModel>(
    "Category",
    categorySchema
);

export function validate(category: ICreateCategoryDto) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
    });

    return schema.validate(category);
}
