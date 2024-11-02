import { Router } from "express";
import client from '@repo/db/primsaClient';

export const authRouter = Router();

authRouter.post('/signup', (req,res) => {
    const {username, password, type} = req.body;
 });

authRouter.post('/signin', () => { });













