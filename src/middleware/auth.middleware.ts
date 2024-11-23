import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: string | JwtPayload; 
}

const verifyUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            success: false,
            message: "No tokens provided"
        });
        return;
    }

    const secret: string = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secret); 
    req.user = decoded;
}

export default verifyUser;