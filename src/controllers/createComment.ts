import pool from '../database/db.js';
import { postCommentSchema } from '../schema.js';
import { Request, Response } from 'express';

const createCommentsController = async (req: Request, res: Response) => {
    const postComment = postCommentSchema.safeParse(req.body);
    if (postComment.success) {
            try {
            if (!req.user) {
                return res.status(401).json({ msg: 'User not authenticated' });
            }

            const { slug } = req.params;
            const userId = req.user.id;

            // Validate inputs
            if (!slug || typeof slug !== 'string') {
                return res.status(400).json({ error: 'Slug is required' });
            }

            // Validate slug format (lowercase, hyphens, alphanumeric)
            const slugRegex = /^[a-z0-9-]+$/;
            if (!slugRegex.test(slug)) {
                return res.status(400).json({ error: 'Invalid slug format' });
            }

            if (!postComment.data.content) {
                return res.status(400).json({ msg: 'Comment content is required' });
            }

            if (postComment.data.content.length > 1000) {
                return res.status(400).json({ msg: 'Comment must be less than 1000 characters' });
            }

            // Check post exists and is published
            const postCheck = await pool.query(
                'SELECT id, slug, status FROM posts WHERE slug = $1',
                [slug]
            );


            if (postCheck.rows.length === 0) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            if (postCheck.rows[0].status !== 'published') {
                return res.status(403).json({ msg: 'Cannot comment on unpublished posts' });
            }

            const postId = postCheck.rows[0].id;

            // Verify parent comment if provided
            if (postComment.data.parentId) {
                if (typeof postComment.data.parentId !== 'number') {
                    return res.status(400).json({ msg: 'Invalid parent comment ID' });
                }

                const parentCheck = await pool.query(
                    'SELECT id, post_id FROM comments WHERE id = $1',
                    [postComment.data.parentId]
                );

                if (parentCheck.rows.length === 0) {
                    return res.status(404).json({ msg: 'Parent comment not found' });
                }

                if (parentCheck.rows[0].post_id !== parseInt(postId)) {
                    return res.status(400).json({ msg: 'Parent comment does not belong to this post' });
                }
            }


            // Insert comment and return with user info (single query)
            const result = await pool.query(
                `INSERT INTO comments (content, post_id, user_id, parent_id)
                VALUES ($1, $2, $3, $4)
                RETURNING 
                    id, 
                    content, 
                    post_id, 
                    user_id, 
                    parent_id, 
                    created_at, 
                    updated_at,
                    (SELECT username FROM users WHERE id = $3) as username,
                    (SELECT email FROM users WHERE id = $3) as email`,
                [postComment.data.content, postId, userId, postComment.data.parentId]
            );

            const comment = result.rows[0];

            return res.status(201).json({
                success: true,
                msg: 'Comment created successfully',
                comment: {
                    id: comment.id,
                    content: comment.content,
                    postId: comment.post_id,
                    parentId: comment.parent_id,
                    createdAt: comment.created_at,
                    updatedAt: comment.updated_at,
                    reader: {
                        id: comment.user_id,
                        username: comment.username,
                        email: comment.email
                    }
                }
            });

        } catch (err) {
            console.error('Error creating comment:', err);
            return res.status(500).json({ msg: 'Server error' });
        }
    } else {
        return res.status(500).json(postComment.error)   
    }

    
};

export default createCommentsController;