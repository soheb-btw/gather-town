import { Router } from "express";
import { userMiddleware } from "../../middleware/user";
import { SpaceSchema } from "@repo/types/zod";
import client from "@repo/db/primsaClient";

export const spaceRouter = Router();

spaceRouter.post('/', userMiddleware, async (req, res) => {
    const parsedData = SpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: 'validation failed' });
        return;
    }

    try {
        // const spaceId = await client.
    } catch (error) {
        res.status(400).json({ message: 'Internal server error' });
    }

});

spaceRouter.delete('/:spaceId', userMiddleware, async (req, res) => {
    const spaceId = req.params.spaceId;
    const space = await client.space.findUnique({
        where: {
            id: spaceId
        }, select: {
            creatorId: true
        }
    });

    if(!space){
        res.status(400).json({message: 'Space not found'});
    }

    if (space?.creatorId !== req.userId) {
        res.status(403).json({ message: "unauthorized" });
        return;
    }

    await client.space.delete({
        where: {
            id: spaceId
        }
    });

    res.json({ message: "space deleted" })
});

spaceRouter.get('/all', () => { });

spaceRouter.get('/:spaceId', () => { });

spaceRouter.post('/element', () => { });

