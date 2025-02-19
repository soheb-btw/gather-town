import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.toString().split(' ')[1];

    console.log('inside sa', req.headers);
    if (!token) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
    }
    if (!process.env.JWT_SECRET) return;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET) as { role: string, userId: string };
        if (user.role !== 'Admin') {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        req.userId = user.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Internal server error' });
    }
}