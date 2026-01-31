import { Request, Response } from 'express';
import pool from '../database/db.js';
import { postContentSchema } from '../schema.js';
import { BadRequestError, ConflictError, ForbiddenError, UnauthorizedError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';



type PostStatus = 'draft' | 'published' | 'archived';

// only an author can create post, so authenticate user as author

const createPostsController = asyncHandler(async(req: Request, res: Response)=> {
    const post = postContentSchema.safeParse(req.body);
    if (post.success) {
            if (!req.user) {
                throw new UnauthorizedError();
            };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

            if (req.user?.role !== 'author') {
                throw new ForbiddenError();
            };

            const {status = 'draft'} = req.body;
            const authorId = req.user?.id;

            const validStatuses: PostStatus[] = ['draft', 'published', 'archived'];
            if (!validStatuses.includes(status)) {
                throw new BadRequestError();
            };

            const generateSlug = (title: string): string => {
                return title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '') 
                .replace(/\s+/g, '-')         
                .replace(/-+/g, '-');         
            };

            const slug = generateSlug(post.data.title);

            const slugCheck = await pool.query(
                'SELECT id FROM posts WHERE slug = $1',
                [slug]
            );

            if (slugCheck.rows.length > 0) {
                throw new ConflictError();
            }; 

            const publishedAt = status === 'published' ? new Date() : null;
    
            
            const result = await pool.query('INSERT INTO posts (title, content, slug, author_id, status, published_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [post.data.title, post.data.content, slug, authorId, status, publishedAt]
            );
    
            const newPost = result.rows[0];

            

            
            return res.status(201).json({post: 
                {
                    id: newPost.id,
                    title: newPost.title,
                    content: newPost.content,
                    slug: newPost.slug,
                    author_id: newPost.authorId,
                    status: newPost.status,
                    published_at: newPost.publishedAt
                }
            });
    } else {
        return res.status(500).json(post.error)
    }
    
});

export default createPostsController;