import {z} from 'zod';

export const signUpSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).trim(),
    username: z.string().min(2).trim(),
    role: z.string().trim()
})

export const signInSchema = z.object({
    email:z.email().trim().toLowerCase(),
    password: z.string().trim().min(8)
})

export const postContentSchema = z.object({
    title: z.string().trim().min(2),
    content: z.string().trim(),
    status: z.string()
})

export const postCommentSchema = z.object({
    content: z.string().trim().min(2),
    parentId: z.number().optional().nullable()
})


export const updatePostSchema = z.object({
    title: z.string().trim().min(2),
    content: z.string().trim()
});