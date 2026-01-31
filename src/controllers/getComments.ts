import { Request, Response } from "express";
import pool from "../database/db.js";
import { BadRequestError, NotFoundError } from "../utils/error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCommentsController = asyncHandler(async(req: Request, res: Response) => {
        const { slug } = req.params;

        // Validate slug
        if (!slug || typeof slug !== 'string') {
            throw new BadRequestError();
        }

        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            throw new BadRequestError();
        }

        // Get post ID from slug
        const postCheck = await pool.query(
            'SELECT id, status FROM posts WHERE slug = $1',
            [slug]
        );

        if (postCheck.rows.length === 0) {
            throw new NotFoundError();
        }

        const post = postCheck.rows[0];

        // Only show comments for published posts (unless you want to allow authors to see drafts)
        if (post.status !== 'published') {
            throw new NotFoundError();
        }

        const postId = post.id;

        // Get all comments for this post
        const result = await pool.query(
            `SELECT 
                comments.id,
                comments.content,
                comments.parent_id,
                comments.created_at,
                comments.updated_at,
                users.id as user_id,
                users.username,
                users.email
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = $1
            ORDER BY comments.created_at ASC`,
            [postId]
        );

        return res.json({
            success: true,
            count: result.rows.length,
            comments: result.rows.map(comment => ({
                id: comment.id,
                content: comment.content,
                parentId: comment.parent_id,
                createdAt: comment.created_at,
                updatedAt: comment.updated_at,
                author: {
                    id: comment.user_id,
                    username: comment.username,
                    email: comment.email
                }
            }))
        });
});

export default getCommentsController;