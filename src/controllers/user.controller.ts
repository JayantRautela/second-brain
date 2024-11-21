import { Request, Response } from "express"
import User from "../models/user.model";
import { z, object, string } from "zod";

const signupSchema = object({
    email: string({
        required_error: "Email is required"
    }).email("Not a valid email"),
    name: string({
        required_error: "Name is required"
    }),
    password: string({
        required_error: "Password is required"
    }).min(6, "Password must contain atleast 6 chracters"),
    username: string({
        required_error: "Username is required"
    }).min(5, "Username must contain 5 characters").max(12, "Usernname length should not be more than 12")
});

export const signup = async (req: Request, res: Response) => {
    try {
        signupSchema.parse(req.body);

        const { email, name, username, password } = req.body;
        
        if (await User.findOne({ email })) {
            return res.status(409).json({
                success: false,
                message: "User with email alrady exists"
            });
        }

        if (await User.findOne({ username })) {
            return res.status(409).json({
                success: false,
                message: "User with username alrady exists"
            });
        }

        const user = await User.create({
            username,
            password,
            email,
            name
        });

        const updatedUser = await User.findById(user._id).select('-password');

        res.status(200).json({
            success: true,
            message: "User singed up successfully",
            updatedUser
        });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const signin = async (req: Request, res: Response) => {

}