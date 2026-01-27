import { Router } from "express";
import pool from "../database/db.js";
import authJWT from "../middlewares/auth.js";

export const getPostsRouter = Router();

getPostsRouter.get('/posts', authJWT, async(req, res)=>{
    try{
        if (!req.user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        };

        const status = 'published';

        const result = await pool.query(
            'SELECT title, content, slug, published_at, status FROM posts WHERE status = $1 ORDER BY published_at ASC LIMIT 10', [status] 
        );


        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const articles = result.rows;

 

        return res.status(200).json({'All Posts': articles});

    } catch (err) {
        console.log('Unable to fetch post', err);
        res.status(500).json({msg: "server error"});
    };

})

export default getPostsRouter;



