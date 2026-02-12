import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import getCommentsController from '../controllers/getComments.js';

const getCommentRouter = Router();


/**
 * @swagger
 * /posts/{slug}/comments:
 *   get:
 *     operationId: getAllComments
 *     tags:
 *       - get all comments under a post     
 *     summary: get all comments under a specific post
 *     description: >
 *     parameters: 
 *       - name: slug
 *         in: path
 *         description: post's slug
 *         required: true
 *         schema: 
 *           type: string
 *         example: /posts/my-article-title  
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: This is a great article!
 *                       postId:
 *                         type: integer
 *                         example: 1
 *                       authorId:
 *                         type: integer
 *                         example: 1
 *                       author:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: johndoe
 *                       parentId:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *                       replies:
 *                         type: array
 *                         items:
 *                           type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-01-15T10:30:00Z
 *       401:
 *         description: Unauthorized - Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Not authenticated. Please login.
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Post not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error  
 *          
 * 
 */
getCommentRouter.get('/posts/:slug/comments', authJWT, getCommentsController);

export default getCommentRouter;