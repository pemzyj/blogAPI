import { Request, Response } from 'express';
import pool from '../database/db.js';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
//to delete post
// only admin and author can delete post
// check if post exist
// admin can delete any post
// author can only delete his own post

const deletePostsController = asyncHandler(async (req: Request, res: Response) => {
        if (req.user?.role !== 'admin' && req.user?.role !== 'author') {
            throw new ForbiddenError();
        }

        const {slug} = req.params;
        const userId = req.user.id; // to get author
        const userRole = req.user?.role; // to get role

        const existingPost = await pool.query(`
            SELECT 
            posts.slug,
            posts.author_id,
            users.username as author_name
            FROM posts
            INNER JOIN users on posts.author_id = users.id
            WHERE posts.slug = $1
            `, [slug]
        );

        if (existingPost.rows.length === 0) {
            throw new NotFoundError();
        }

        const post = existingPost.rows[0];

        const isAdmin = userRole === 'admin';
        const isAuthor = post.author_id = userId;

        if (!isAdmin || !isAuthor) {
            throw new ForbiddenError();
        }

        

        const result = await pool.query(
            'DELETE from posts WHERE slug = $1 RETURNING slug', [slug]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError();
        };



        return res.status(200).json({success: true,
            msg: isAdmin && !isAuthor
                ? 'Post deleted by admin' 
                : 'Post deleted successfully',
            deletedPostId: result.rows[0].id
        });
});

export default deletePostsController;