import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import deleteCommentsController from '../controllers/deleteComments.js';


const deleteCommentRouter = Router();

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *       operationId: deleteComments
 *       summary: delete comments 
 *       description: >
 *       parameters: 
 *         - name: id
 *           in: path
 *           description: comment id
 *           required: true
 *           schema: 
 *             type: integer
 *           example: /comments/1
 *       responses:
 *         200:
 *           description: Comment deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: Comment deleted successfully
 *         401:
 *           description: Unauthorized - Not authenticated
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Not authenticated. Please login.
 *         403:
 *           description: Forbidden - Not the comment author or admin
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: You do not have permission to delete this comment
 *         404:
 *           description: Comment not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Comment not found
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Internal server error
 *          
 * 
 */
deleteCommentRouter.delete('/comments/:id', authJWT, deleteCommentsController); 

export default deleteCommentRouter;