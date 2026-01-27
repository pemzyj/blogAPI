import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import pool from '../database/db.js';

const deleteCommentRouter = Router();

deleteCommentRouter.delete('/comments/:id', authJWT, async(req, res) => {
    try{
        if (req.user?.role !== 'admin' && req.user?.role !== 'reader') {
            return res.status(403).json('cannot delete post');
        }

        const {id} = req.params;
        const userRole = req.user?.role;
        const userId = req.user?.id;

        if (!id || typeof id === 'number') {
            return res.status(400).json('Invalid id');
        }

        // Check if comment exists and get its details
            const commentCheck = await pool.query(
                `SELECT 
                    comments.id,
                    comments.user_id,
                    comments.content,
                    users.username as author_name
                FROM comments
                INNER JOIN users ON comments.user_id = users.id
                WHERE comments.id = $1`,
                [id]
            );

            if (commentCheck.rows.length === 0) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            const comment = commentCheck.rows[0];
        
        // Authorization check:
        // - Admins can delete any comment
        // - Users can only delete their own comments
        const isOwner = comment.user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ 
                msg: 'Access denied. You can only delete your own comments.',
                commentOwner: comment.author_name,
                yourRole: userRole
            });
        }
        

        const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING id', [id]);
        

        if (result.rows.length === 0) {
            return res.status(401).json('Comment does not exist');
        }

        return res.status(200).json({
            success: true,
            msg: isAdmin && !isOwner 
                ? 'Comment deleted by admin' 
                : 'Comment deleted successfully',
            deletedCommentId: result.rows[0].id
        });
    } catch (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
}); 

export default deleteCommentRouter;