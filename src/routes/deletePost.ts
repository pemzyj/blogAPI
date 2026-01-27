import {Router} from 'express';
import pool from '../database/db.js';
import authJWT from '../middlewares/auth.js';

const deletePostRouter = Router();

//to delete post
// only admin and author can delete post
// check if post exist
// admin can delete any post
// author can only delete his own post


deletePostRouter.delete('/posts/:slug', authJWT, async (req, res) => {
    try{
        if (req.user?.role !== 'admin' && req.user?.role !== 'author') {
            return res.status(403).json({msg: "access denied"});
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
            return res.status(404).json({ msg: 'Post not found' });
        }

        const post = existingPost.rows[0];

        const isAdmin = userRole === 'admin';
        const isAuthor = post.author_id = userId;

        if (!isAdmin || !isAuthor) {
            return res.status(403).json({ 
                msg: 'Access denied. You can only delete your own posts.',
                postOwner: post.author_name,
                yourRole: userRole
            });
        }

        

        const result = await pool.query(
            'DELETE from posts WHERE slug = $1 RETURNING slug', [slug]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({msg: 'Post does not exists'})
        };



        return res.status(200).json({success: true,
            msg: isAdmin && !isAuthor
                ? 'Post deleted by admin' 
                : 'Post deleted successfully',
            deletedPostId: result.rows[0].id
        });
    } catch (err) {
        console.error('Error deleting post:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
})
    

export default deletePostRouter;