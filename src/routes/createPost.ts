import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import pool from '../database/db.js';
import { postContentSchema } from '../schema.js';

const createPostRouter = Router();

type PostStatus = 'draft' | 'published' | 'archived';

// only an author can create post, so authenticate user as author

createPostRouter.post('/create', authJWT, async(req, res)=> {
    const post = postContentSchema.safeParse(req.body);
    if (post.success) {
        try{
            if (!req.user) {
                return res.status(401).json({ msg: 'User not authenticated' });
            };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

            if (req.user?.role !== 'author') {
                return res.status(400). json({msg: 'Only authors can create post'})
            };

            const {status = 'draft'} = req.body;
            const authorId = req.user?.id;

            const validStatuses: PostStatus[] = ['draft', 'published', 'archived'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    msg: 'Invalid status. Must be one of: draft, published, archived',
                    validStatuses: validStatuses
                });
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
                return res.status(400).json({
                    msg: 'A post with this title already exists. Please use a different title.'
                });
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

        }catch (err) {
            console.error('Unable to create post', err);
            return res.status(500).json({msg:'server error'})
        }
    } else {
        return res.status(500).json(post.error)
    }
    
});

export default createPostRouter;