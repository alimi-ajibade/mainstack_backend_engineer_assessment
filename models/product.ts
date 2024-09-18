import mongoose, { Error } from "mongoose";
import Joi from "joi";
import { IProduct, ProductModel } from "../types/product";
import { ICreateProductDto } from "../types/dtos/createProductDto";
import JoiObjectId from "@marsup/joi-objectid";
import slugify from "slugify";
import { CategoryModel, ICategory } from "../types/category";

const extendedJoi = Joi.extend(JoiObjectId);

export const productSchema = new mongoose.Schema<IProduct, ProductModel>(
    {
        title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255,
            trim: true,
        },
        slug: {
            type: String,
            minlength: 5,
            maxlength: 255,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 1024,
            lowercase: true,
            trim: true,
        },
        unit_price: {
            type: Number,
            min: 0.1,
            required: true,
        },
        inventory: {
            type: Number,
            min: 0,
            required: true,
        },
        category: {
            type: new mongoose.Schema<ICategory, CategoryModel>({
                title: {
                    type: String,
                    required: true,
                    minlength: 3,
                    maxlength: 100,
                    lowercase: true,
                    trim: true,
                },
            }),
        },
    },
    { timestamps: true }
);

// index
productSchema.index({ slug: 1 });
productSchema.index({ unit_price: 1 });
productSchema.index({ description: "text" });

// pre save
productSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        // Only generate slug if title is modified
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export const Product = mongoose.model<IProduct, ProductModel>(
    "Product",
    productSchema
);

export function validate(product: ICreateProductDto) {
    const schema = extendedJoi.object({
        title: extendedJoi.string().min(5).max(255).required(),
        description: extendedJoi.string().min(5).max(1024).required(),
        unit_price: extendedJoi.number().min(0.1).required(),
        inventory: extendedJoi.number().min(0).required(),
        categoryId: extendedJoi.objectId().required(),
    });

    return schema.validate(product);
}

export function validateUpdate(product: Partial<ICreateProductDto>) {
    const schema = extendedJoi.object({
        title: extendedJoi.string().min(5).max(255),
        description: extendedJoi.string().min(5).max(1024),
        unit_price: extendedJoi.number().min(0.1),
        inventory: extendedJoi.number().min(0),
        categoryId: extendedJoi.objectId(),
    });

    return schema.validate(product);
}
