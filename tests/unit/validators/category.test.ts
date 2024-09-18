import { validate } from "../../../models/category";
import { ICreateCategoryDto } from "../../../types/dtos/createCategoryDto";

describe("validate category", () => {
    it("should return error if title is too short", () => {
        const category: ICreateCategoryDto = { title: "ab" };
        const result = validate(category);

        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain(
            "length must be at least 3 characters long"
        );
    });

    it("should return error if title is too long", () => {
        const category: ICreateCategoryDto = { title: "a".repeat(51) };
        const result = validate(category);

        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain(
            "length must be less than or equal to 50 characters long"
        );
    });

    it("should return error if title is missing", () => {
        const category = {} as ICreateCategoryDto;
        const result = validate(category);

        expect(result.error).not.toBeNull();
        expect(result.error?.details[0].message).toContain("required");
    });

    it("should validate successfully when title is valid", () => {
        const category: ICreateCategoryDto = { title: "Valid Title" };
        const result = validate(category);

        expect(result.error).toBeUndefined();
    });
});
