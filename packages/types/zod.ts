import zod from 'zod';

export const SignUpSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8),
    type: zod.enum(['admin', 'user'])
});

export const SignInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8)
});

export const UpdateMetadataSchema = zod.object({
    avatarId: zod.string()
})

export const GetMetadataSchema = zod.object({
    userIds: zod.array(zod.string())
});

export const SpaceSchema = zod.object({
    name: zod.string(),
    dimensions: zod.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: zod.string()
});

export const AddElementSchema = zod.object({
    elementId: zod.string(),
    spaceId: zod.string(),
    x: zod.number(),
    y: zod.number()
});

export const CreateElementSchema = zod.object({
    imageUrl: zod.string(),
    static: zod.boolean(),
    width: zod.string(),
    height: zod.number(),
});

export const UpdateElementSchema = zod.object({
    imageUrl: zod.string()
});

export const CreateAvatarSchema = zod.object({
    imageUrl: zod.string(),
    name: zod.string()
})

export const CreateMapSchema = zod.object({
    thumbnail: zod.string(),
    dimensions: zod.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements: zod.array(zod.object({
        elementId: zod.string(),
        x: zod.number(),
        y: zod.number()
    }))
});
