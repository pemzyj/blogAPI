import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import pool from '../database/db.js';

const getCommentRouter = Router();

getCommentRouter.get('/posts/:slug/comments', authJWT, async(req, res) => {
    try {
        const { slug } = req.params;

        // Validate slug
        if (!slug || typeof slug !== 'string') {
            return res.status(400).json({ error: 'Slug is required' });
        }

        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            return res.status(400).json({ error: 'Invalid slug format' });
        }

        // Get post ID from slug
        const postCheck = await pool.query(
            'SELECT id, status FROM posts WHERE slug = $1',
            [slug]
        );

        if (postCheck.rows.length === 0) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const post = postCheck.rows[0];

        // Only show comments for published posts (unless you want to allow authors to see drafts)
        if (post.status !== 'published') {
            return res.status(403).json({ msg: 'Cannot view comments on unpublished posts' });
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

    } catch (err) {
        console.error('Error fetching comments:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
})

export default getCommentRouter;