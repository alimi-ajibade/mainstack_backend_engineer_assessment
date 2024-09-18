import express from "express";
import { auth } from "../middlewares/auth";
import AuthenticatedRequest from "../types/authenticatedRequest";
import { Category, validate } from "../models/category";
import { Product } from "../models/product";
import _ from "lodash";
import { ICreateCategoryDto } from "../types/dtos/createCategoryDto";

const router = express.Router();

router.get("/", auth, async (req: AuthenticatedRequest, resp) => {
    const category = await Category.find().select("-__v");
    resp.send(category);
});

router.get("/:id", auth, async (req: AuthenticatedRequest, resp) => {
    const category = await Category.findById(req.params.id);

    if (!category)
        return resp.status(404).send({ error: "no category with given id" });

    return resp
        .status(200)
        .send({ category: _.omit(category.toObject(), ["__v"]) });
});

router.post("/", auth, async (req: AuthenticatedRequest, resp) => {
    const payload = req.body as ICreateCategoryDto;

    const { error } = validate(payload);

    if (error)
        return resp.status(400).send({ error: error.details[0].message });

    const category = await Category.findOne({ title: payload.title });

    if (category)
        return resp.status(409).send({
            error: `category with title "${category.title}" already exist`,
        });

    const newCategory = new Category(_.pick(payload, ["title"]));

    await newCategory.save();

    return resp.status(201).send({
        detail: "category successfully created",
        category: _.omit(newCategory.toObject(), ["__v"]),
    });
});

router.put("/:id", auth, async (req: AuthenticatedRequest, resp) => {
    const payload = req.body as ICreateCategoryDto;

    const { error } = validate(payload);

    if (error)
        return resp.status(400).send({ error: error.details[0].message });

    // check if category already exists
    const existingCategory = await Category.findOne({ title: payload.title });

    if (existingCategory)
        return resp.status(409).send({
            error: `category with title "${existingCategory.title}" already exist`,
        });

    const category = await Category.findById(req.params.id);

    if (!category)
        return resp.status(404).send({ error: "no category with given id" });

    category.title = payload.title;

    await category.save();

    return resp.status(200).send({
        detail: "category successfully updated",
        category: _.omit(category.toObject(), ["__v"]),
    });
});

router.delete("/:id", auth, async (req: AuthenticatedRequest, resp) => {
    const productsWithCategory = await Product.find({
        "category._id": req.params.id,
    });

    // If products exist, prevent deletion
    if (productsWithCategory.length > 0) {
        return resp.status(400).send({
            error: `Category cannot be deleted because it is associated with ${productsWithCategory.length} product(s).`,
        });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    await category!.save();

    return resp.status(200).send({ detail: "category deleted" });
});

export default router;
