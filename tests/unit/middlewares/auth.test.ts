import { User } from "../../../models/user";
import { auth } from "../../../middlewares/auth";
import { Request, Response, NextFunction } from "express"; // Import express types
import AuthenticatedRequest from "../../../types/authenticatedRequest";

describe("auth middleware", () => {
    test("should populate req with the user property", () => {
        const token = new User().generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token),
        } as Partial<AuthenticatedRequest>;

        const res = {} as Partial<Response>;
        const next = jest.fn() as NextFunction;

        auth(req as AuthenticatedRequest, res as Response, next);

        expect(req.user).toBeDefined();
    });
});
