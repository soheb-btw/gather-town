import { Router } from "express";
import client from '@repo/db/primsaClient';
import { SignInSchema, SignUpSchema } from '@repo/types/zod'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: 'Insufficient Data' });
        return;
    }


    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    try {
        const user = await client.user.create({
            data: {
               username: parsedData.data.username,
               password: hashedPassword,
               role: parsedData.data.type === 'admin' ? 'Admin' : 'User',
            }
        });
        res.json({userId: user.id});
    } catch (error) {
        res.status(400).json({message: "Account Already Exists !!!", error});
    }
});

authRouter.post('/signin',async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(403).json({message: "Insufficient Data"});
        return
    }
    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        });

        if(!user){
            res.status(403).json({message: "User does not exists"});
            return;
        }

        const passwordValid = await bcrypt.compare(parsedData.data.password, user.password);
        if(!passwordValid){
            res.status(403).json({message: "Invalid password"});
            return;
        }

        if(!process.env.JWT_SECRET) {
            res.status(403).json({message: "something went wrong"});
            return;
        }
        
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.json({token});
    } catch (error) {
        res.status(403).json({message: "something went wrong"});
      }
 });













