// validateProduct.test.ts

import { validate } from "../../../models/product";
import { ICreateProductDto } from "../../../types/dtos/createProductDto";

describe("validate product", () => {
    it("should return error if title is too short", () => {
        const product: ICreateProductDto = {
            title: "abcd",
            description: "Valid descriptio",
            unit_price: 10,
            inventory: 5,
            categoryId: "507f191e810c19729de860ea",
        };
        const result = validate(product);

        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain(
            "length must be at least 5 characters long"
        );
    });

    it("should return error if description is too short", () => {
        const product: ICreateProductDto = {
            title: "GTA V",
            description: "abcd",
            unit_price: 10,
            inventory: 5,
            categoryId: "507f191e810c19729de860ea",
        };
        const result = validate(product);

        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain(
            "length must be at least 5 characters long"
        );
    });

    it("should return error if unit_price is below minimum", () => {
        const product: ICreateProductDto = {
            title: "GTA V",
            description: "best game ever until gta 6",
            unit_price: 0.05,
            inventory: 5,
            categoryId: "507f191e810c19729de860ea",
        };
        const result = validate(product);

        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain(
            "must be greater than or equal to 0.1"
        );
    });

    it("should return error if inventory is negative", () => {
        const product: ICreateProductDto = {
            title: "GTA V",
            description: "best game ever until gta 6",
            unit_price: 10,
            inventory: -1,
            categoryId: "507f191e810c19729de860ea",
        };
        const result = validate(product);

        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain(
            "must be greater than or equal to 0"
        );
    });

    it("should return error if categoryId is not a valid ObjectId", () => {
        const product: ICreateProductDto = {
            title: "GTA V",
            description: "best game ever until gta 6",
            unit_price: 10,
            inventory: 5,
            categoryId: "3849difjcjf38ud",
        };
        const result = validate(product);
        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain("ObjectId");
    });

    it("should validate successfully with valid product data", () => {
        const product: ICreateProductDto = {
            title: "Valid Title",
            description: "This is a valid product description",
            unit_price: 50,
            inventory: 10,
            categoryId: "507f191e810c19729de860ea",
        };
        const result = validate(product);

        expect(result.error).toBeUndefined();
    });
});
