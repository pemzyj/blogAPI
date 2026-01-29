import {Router} from 'express';
import pool from '../database/db.js';
import authJWT from '../middlewares/auth.js';


export const getPostRouter = Router();

getPostRouter.get('/posts/:slug', authJWT, async(req, res) => {
    try {

        const { slug } = req.params;

        if (!slug || typeof slug !== 'string') {
            return res.status(400).json({ error: 'Slug is required' });
        }

        // Validate slug format (lowercase, hyphens, alphanumeric)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            return res.status(400).json({ error: 'Invalid slug format' });
        }

        const result = await pool.query(
            `SELECT 
                posts.id,
                posts.title,
                posts.content,
                posts.slug,
                posts.status,
                posts.published_at,
                posts.created_at,
                posts.updated_at,
                users.id as author_id,
                users.username as author_name,
                users.email as author_email,
                COUNT(comments.id) as comment_count
            FROM posts
            INNER JOIN users ON posts.author_id = users.id
            LEFT JOIN comments ON posts.id = comments.post_id
            WHERE posts.slug = $1
            GROUP BY posts.id, users.id`,
            [slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const post = result.rows[0];

        // Only show published posts to public
        if (post.status !== 'published') {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({
            success: true,
            data: {
                id: post.id,
                title: post.title,
                content: post.content,
                slug: post.slug,
                publishedAt: post.published_at,
                createdAt: post.created_at,
                updatedAt: post.updated_at,
                author: {
                    id: post.author_id,
                    name: post.author_name,
                    email: post.author_email
                },
                commentCount: parseInt(post.comment_count)
            }
        });

    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//get post by author name
export const getPostByQuery = Router();

getPostByQuery.get('/posts', authJWT, async (req, res) => {
    try {
        const {author} = req.query;

        if (!author) {
            const { slug } = req.params;

            if (!slug || typeof slug !== 'string') {
             return res.status(400).json({ error: 'Slug is required' });
            }

            // Validate slug format (lowercase, hyphens, alphanumeric)
            const slugRegex = /^[a-z0-9-]+$/;
            if (!slugRegex.test(slug)) {
                return res.status(400).json({ error: 'Invalid slug format' });
            }

            const result = await pool.query(
                `SELECT 
                    posts.id,
                    posts.title,
                    posts.content,
                    posts.slug,
                    posts.status,
                    posts.published_at,
                    posts.created_at,
                    posts.updated_at,
                    users.id as author_id,
                    users.username as author_name,
                    users.email as author_email,
                    COUNT(comments.id) as comment_count
                FROM posts
                INNER JOIN users ON posts.author_id = users.id
                LEFT JOIN comments ON posts.id = comments.post_id
                WHERE posts.slug = $1
                GROUP BY posts.id, users.id`,
                [slug]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const post = result.rows[0];

            // Only show published posts to public
            if (post.status !== 'published') {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.json({
                success: true,
                data: {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    slug: post.slug,
                    publishedAt: post.published_at,
                    createdAt: post.created_at,
                    updatedAt: post.updated_at,
                    author: {
                        id: post.author_id,
                        name: post.author_name,
                        email: post.author_email
                    },
                    commentCount: parseInt(post.comment_count)
                }
            }); 
        };

        const authorPost = await pool.query(
            `SELECT 
            posts.title,
            posts.content, 
            posts.slug, 
            posts.status,
            posts.published_at, 
            users.id,
            users.email, 
            users.username as author_name
            FROM posts
            ORDER BY posts.published_at ASC
            INNER JOIN users ON posts.author_id = users.id
            WHERE users.username = $1
            `, [author]
        );


    } catch (err) {

    }
    /* try {
        const { author } = req.query;

        let query = `
            SELECT 
                posts.id,
                posts.title,
                posts.slug,
                users.id as author_id,
                users.username as author_name
            FROM posts
            INNER JOIN users ON posts.author_id = users.id
        `;

        const params: any[] = [];

        // Check if filtering by username or ID
        if (author) {
            if (isNaN(Number(author))) {
                // It's a username (string)
                query += ' WHERE users.username ILIKE $1';
                params.push(author);
            } else {
                // It's an ID (number)
                query += ' WHERE posts.author_id = $1';
                params.push(author);
            }
        }

        query += ' ORDER BY posts.created_at DESC';

        const result = await pool.query(query, params);

        return res.json({
            success: true,
            posts: result.rows
        });

    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ msg: 'Server error' });
    } */

}) 

