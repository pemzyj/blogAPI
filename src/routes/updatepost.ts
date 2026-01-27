import {Router} from 'express';
import pool from '../database/db.js';
import authJWT from '../middlewares/auth.js';

const updatePostsRouter = Router();

updatePostsRouter.put('/posts/:slug', authJWT, async(req, res) => {
    try{
        if (req.user?.role !== "author") {
            return res.status(403).json({msg: "Unauthorized"});
        }

        const {slug} = req.params;

        if (!slug || typeof slug !== 'string') {
            return res.status(400).json({ error: 'Slug is required' });
        }

        const slugRegex = /^[a-z0-9-]+$/;
        
        if (!slugRegex.test(slug)) {
            return res.status(400).json({ error: 'Invalid slug format' });
        }


        const authorUserName = req.user?.username;

        const postAuthor = await pool.query(
            'SELECT users.username as username from posts INNER JOIN users ON posts.author_id = users.id WHERE slug = $1', [slug]
        )

        if (postAuthor.rows.length === 0) {
            return res.status(401).json({msg: "Post doesn't exist"});
        }

        const author = postAuthor.rows[0].username;

        if (authorUserName !== author) {
            return res.status(401).json({msg: "only post's author can edit post"});
        }

        const {title, content} = req.body;

        const updated_at = new Date();

        const result = await pool.query(
            'UPDATE posts SET title = $1, content = $2, updated_at = $3 WHERE slug = $4 RETURNING (title, content, updated_at)', [title, content, updated_at, slug]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({msg: "Post doesn't exist"});
        }

        const updatedPost = result.rows[0];
        console.log(updatedPost);
        

        return res.status(201).json(updatedPost);
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: "server error"});
    }
})

export default updatePostsRouter;