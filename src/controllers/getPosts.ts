import { Request, Response } from "express";
import pool from "../database/db.js";

export const getPostsController = async(req: Request, res: Response) => {
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
};

export const getPostsByQueryController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        };

        const {author} = req.query;

        if (!author) {
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
                WHERE posts.status = 'published'
                GROUP BY posts.id, users.id
                ORDER BY posts.published_at DESC LIMIT 10`
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            return res.json({  
                success: true,
                count: result.rows.length, 
                allPosts: result.rows.map(post => ({
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
                    commentCount: parseInt(post.comment_count)  //
                }))
            }); 
        }

        const authorPost = await pool.query(
            `SELECT 
            posts.title,
            posts.content, 
            posts.slug, 
            posts.status,
            posts.published_at, 
            users.id as author_id,
            users.email as author_email, 
            users.username as author_name,
            COUNT(comments.id) as comment_count
            FROM posts
            INNER JOIN users ON posts.author_id = users.id
            LEFT JOIN comments ON posts.id = comments.post_id
            WHERE users.username = $1 AND posts.status = 'published'
            GROUP BY posts.id, users.id
            ORDER BY posts.published_at DESC
            `, [author]
        );

        if (authorPost.rows.length === 0) {
            return res.status(400).json('Author has no post');
        }

        return res.json({  
                success: true,
                count: authorPost.rows.length,
                author: author,  
                data: authorPost.rows.map(post => ({ 
                    title: post.title,
                    content: post.content,
                    slug: post.slug,
                    publishedAt: post.published_at,  
                    author: {
                        id: post.author_id,
                        name: post.author_name,
                        email: post.author_email
                    },
                    commentCount: parseInt(post.comment_count)
                }))
            });


    } catch (err) {
        console.error('Unable to get author\'s posts', err);
        return res.status(500).json({Error: 'Internal server error'});
    };
};