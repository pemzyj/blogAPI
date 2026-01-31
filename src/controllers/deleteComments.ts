import pool from '../database/db.js';
import { Request, Response } from 'express';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';


const deleteCommentsController = asyncHandler(async(req: Request, res: Response) => {
        if (req.user?.role !== 'admin' && req.user?.role !== 'reader') {
            throw new ForbiddenError();
        }

        const {id} = req.params;
        const userRole = req.user?.role;
        const userId = req.user?.id;

        if (!id || typeof id === 'number') {
            throw new BadRequestError();
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
                throw new NotFoundError();
            }

            const comment = commentCheck.rows[0];
        
        // Authorization check:
        // - Admins can delete any comment
        // - Users can only delete their own comments
        const isOwner = comment.user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            throw new ForbiddenError();
        }
        

        const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING id', [id]);
        

        if (result.rows.length === 0) {
            throw new NotFoundError();
        }

        return res.status(200).json({
            success: true,
            msg: isAdmin && !isOwner 
                ? 'Comment deleted by admin' 
                : 'Comment deleted successfully',
            deletedCommentId: result.rows[0].id
        });
});

export default deleteCommentsController;