import { Request, Response } from "express";
import pool from "../database/db.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updatePostController = asyncHandler(async(req: Request, res: Response) => {
        if (req.user?.role !== "author") {
            throw new ForbiddenError('Permission denied');
        }

        const {slug} = req.params;

        if (!slug || typeof slug !== 'string') {
            throw new BadRequestError();
        }

        const slugRegex = /^[a-z0-9-]+$/;
        
        if (!slugRegex.test(slug)) {
            throw new BadRequestError();
        }


        const authorUserName = req.user?.username;

        const postAuthor = await pool.query(
            'SELECT users.username as username from posts INNER JOIN users ON posts.author_id = users.id WHERE slug = $1', [slug]
        )

        if (postAuthor.rows.length === 0) {
            throw new NotFoundError();
        }

        const author = postAuthor.rows[0].username;

        if (authorUserName !== author) {
            throw new ForbiddenError();
        }

        const {title, content} = req.body;

        const updated_at = new Date();

        const result = await pool.query(
            'UPDATE posts SET title = $1, content = $2, updated_at = $3 WHERE slug = $4 RETURNING (title, content, updated_at)', [title, content, updated_at, slug]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError();
        }

        const updatedPost = result.rows[0];
        console.log(updatedPost);
        

        return res.status(201).json(updatedPost);
});

export default updatePostController;