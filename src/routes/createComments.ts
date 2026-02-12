import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import createCommentsController from '../controllers/createComment.js';


const createCommentRouter = Router();

/**
 * @swagger
 * /posts/{slug}/comments:
 *   post:
 *     operationId: createComments
 *     summary: write comments under a particular post or comment
 *     description: >
 *     parameters: 
 *       - name: slug
 *         in: path
 *         description: post slug
 *         required: true
 *         schema: 
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               content:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comment created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: This is a great article!
 *                     postId:
 *                       type: integer
 *                       example: 1
 *                     authorId:
 *                       type: integer
 *                       example: 1
 *                     parentId:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z  
 *       400:
 *         description: Bad request - Invalid input
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
 *                   example: Comment content is required
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
 *         description: Post or parent comment not found
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
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Internal server error
 *   
 */
createCommentRouter.post('/posts/:slug/comments', authJWT, createCommentsController);

export default createCommentRouter;



