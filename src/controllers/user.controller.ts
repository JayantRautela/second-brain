import { Request, Response } from "express"
import User from "../models/user.model";
import { z, object, string } from "zod";
import jwt, { TokenExpiredError } from 'jsonwebtoken';

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

const signinSchema = object({
    email: string({
        required_error: "email is required"
    }).email("not a valid email"),
    password: string({
        required_error: "password is required"
    })
})

export const signup = async (req: Request, res: Response):Promise<void> => {
    try {
        signupSchema.parse(req.body);

        const { email, name, username, password } = req.body;
        
        if (await User.findOne({ email })) {
            res.status(409).json({
                success: false,
                message: "User with email alrady exists"
            });
            return;
        }

        if (await User.findOne({ username })) {
            res.status(409).json({
                success: false,
                message: "User with username alrady exists"
            });
            return;
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
        console.error(error);
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        signinSchema.parse(req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User does not exists"
            });
            return;
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
            return;
        }

        const secret: string = process.env.JWT_SECRET as string

        const token = jwt.sign(user.username, secret);

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token: token
        });
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}