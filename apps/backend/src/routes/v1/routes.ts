import { Router } from "express";
import { authRouter } from "./auth";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { userRouter } from "./user";

export const router = Router();


router.use('/', authRouter);
router.use('/admin', adminRouter);
router.use('/space', spaceRouter);
router.use('/user', userRouter);
