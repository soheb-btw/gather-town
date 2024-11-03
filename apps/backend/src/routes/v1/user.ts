import { Router } from "express";
import { GetMetadataSchema, UpdateMetadataSchema } from "@repo/types/zod";
import { userMiddleware } from "../../middleware/user";
import client from '@repo/db/primsaClient';

export const userRouter = Router();

userRouter.post('/metadata', userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: 'Validation failed' });
        return;
    }

    try {
        await client.user.update({
            where: {
                id: req.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        });
        res.json({ message: "Avatar updated" });
    } catch (error) {
        res.status(400).json({ message: 'Internal server error' });
    }
});

userRouter.get('/avatars', userMiddleware, async (req, res) => {
    try {
        const avatars = await client.avatar.findMany();
        res.json({ avatars });
    } catch (error) {
        res.status(400).json({ message: 'Interval server error' });
    }
});

userRouter.get('/metadata/bulk', userMiddleware, async (req, res) => {
    const users = (req.query.ids ?? '[]') as string;
    const userIds = (users).slice(1, users?.length - 2).split(",");

    const parsedData = GetMetadataSchema.safeParse(userIds);
    if (!parsedData.success) {
        res.status(400).json({ message: 'Validation failed' });
        return;
    }

    try {
        const metadata = await client.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            }, select: {
                avatar: true,
                id: true
            }
        });
        res.json({
            avatars: metadata.map(data => ({ userId: data.id, avatarId: data.avatar?.imageUrl }))
        })
    } catch (error) {
        res.status(400).json({ message: 'Internal server error' });
    }

});
