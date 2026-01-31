import { Request, Response } from "express";
import pool from "../database/db.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPostsController = asyncHandler(async(req: Request, res: Response) => {
        const { slug } = req.params;

        if (!slug || typeof slug !== 'string') {
            throw new BadRequestError();
        }

        // Validate slug format (lowercase, hyphens, alphanumeric)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            throw new BadRequestError();
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
            throw new NotFoundError();
        }

        const post = result.rows[0];

        // Only show published posts to public
        if (post.status !== 'published') {
            throw new NotFoundError();
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
});

export const getPostsByQueryController = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new UnauthorizedError();
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
                throw new NotFoundError();
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
            throw new NotFoundError('Author has no post');
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
});