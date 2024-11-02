import { Router } from "express";

export const userRouter = Router();

userRouter.post('/user/metadata', () => { });
userRouter.get('/user/bulk?ids=[1,2,3]', () => { });
