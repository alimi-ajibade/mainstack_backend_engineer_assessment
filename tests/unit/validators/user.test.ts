import { validateUser } from "../../../models/user";
import { CreateUserDto } from "../../../types/dtos/createUser";

describe("validateUser", () => {
    it("should return error if fullname is too short", () => {
        const user: CreateUserDto = {
            fullname: "Alim",
            email: "alimi@mainstack.com",
            password: "Password@123",
        };
        const result = validateUser(user);

        expect(result.error).not.toBeNull();
        expect(result.error!.message).toMatch(/fullname/);
    });

    it("should return error if email is invalid", () => {
        const user: CreateUserDto = {
            fullname: "Alimi David",
            email: "alimiDavid",
            password: "Password@123",
        };
        const result = validateUser(user);

        expect(result.error).not.toBeNull();
        expect(result.error!.message).toMatch(/email/);
    });

    it("should return error if password does not meet the criteria", () => {
        const user: CreateUserDto = {
            fullname: "Alimi David",
            email: "alimi@example.com",
            password: "noSpecial123", // No special characters
        };
        const result = validateUser(user);

        expect(result.error).not.toBeNull();
        expect(result.error!.message).toMatch(/password/);
    });

    it("should validate the user successfully", () => {
        const user: CreateUserDto = {
            fullname: "Alimi David",
            email: "alimi@mainstack.com",
            password: "Password@123", // Meets all criteria
        };
        const result = validateUser(user);

        expect(result.error).toBeUndefined();
    });
});
