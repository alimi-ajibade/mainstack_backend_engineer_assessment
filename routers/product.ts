import express from "express";
import _ from "lodash";
import multer from "multer";
import { auth } from "../middlewares/auth";
import AuthenticatedRequest from "../types/authenticatedRequest";
import { Product } from "../models/product";
import { ICreateProductDto } from "../types/dtos/createProductDto";
import { validate, validateUpdate } from "../models/product";
import { Category } from "../models/category";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", auth, async (req: AuthenticatedRequest, resp) => {
    const {
        searchQuery,
        category,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page as string, 10));
    const limitNumber = Math.max(1, parseInt(limit as string, 10));
    const skip = (pageNumber - 1) * limitNumber;

    // Define the base query object
    const query: any = {};

    if (category) {
        const title = category as string;
        query["category.title"] = title.toLowerCase();
    }

    // Filter by price range if minPrice or maxPrice is provided
    if (minPrice || maxPrice) {
        query.unit_price = {};
        if (minPrice) {
            query.unit_price.$gte = parseFloat(minPrice as string);
        }
        if (maxPrice) {
            query.unit_price.$lte = parseFloat(maxPrice as string);
        }
    }

    if (searchQuery) {
        query.$text = { $search: searchQuery as string };
    }

    // Fetch listings with pagination and filters
    const products = await Product.find(query)
        .skip(skip)
        .limit(limitNumber)
        .select("-__v");

    const total = await Product.countDocuments(query);

    return resp.status(200).send({
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total,
        products,
    });
});

router.get("/:id", auth, async (req: AuthenticatedRequest, resp) => {
    const product = await Product.findById(req.params.id);

    if (!product)
        return resp.status(404).send({ error: "no product with given id" });

    return resp
        .status(200)
        .send({ product: _.omit(product.toObject(), ["__v"]) });
});

router.put("/:id", auth, async (req: AuthenticatedRequest, resp) => {
    const {
        title,
        description,
        inventory,
        unit_price,
        categoryId: category,
    } = req.body as ICreateProductDto;

    const { error } = validateUpdate(req.body);
    if (error)
        return resp.status(400).send({ error: error.details[0].message });

    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return resp.status(400).json({ error: "Category not found" });
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            ...(title && { title }),
            ...(description && { description }),
            ...(inventory && { inventory }),
            ...(unit_price && { unit_price }),
            ...(category && { category }),
        },
        { new: true, runValidators: true }
    );

    if (!updatedProduct) {
        return resp.status(404).json({ error: "Product not found" });
    }

    return resp
        .status(200)
        .send({ product: _.omit(updatedProduct.toObject(), ["__v"]) });
});

router.post("/", auth, async (req: AuthenticatedRequest, resp) => {
    const payload = req.body as ICreateProductDto;

    const { error } = validate(payload);

    if (error)
        return resp.status(400).send({ error: error.details[0].message });

    const category = await Category.findById(payload.categoryId);

    if (!category)
        return resp.status(409).send({
            error: `invalid category`,
        });

    const product = new Product({
        title: payload.title,
        description: payload.description,
        category: {
            _id: category._id,
            title: category.title,
        },
        unit_price: payload.unit_price,
        inventory: payload.inventory,
    });

    await product.save();

    return resp.status(201).send({
        detail: "product successfully created",
        product: _.omit(product.toObject(), ["__v"]),
    });
});

router.delete("/:id", auth, async (req: AuthenticatedRequest, resp) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return resp.status(404).send({ error: "Product not found" });
    }

    await product.deleteOne();

    resp.status(200).send({ detail: "Product deleted successfully" });
});

export default router;
