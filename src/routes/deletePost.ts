import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import deletePostsController from '../controllers/deletePost.js';

const deletePostRouter = Router();



/**
 * @swagger
 * /posts/{slug}:
 *   delete:
 *     summary: delete specified post using the post slug
 *     operationId: deletePosts
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
 *         description: Post deleted successfully
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
 *                   example: Post deleted successfully
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
 *       403:
 *         description: Forbidden - Not the post author or admin
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
 *                   example: You do not have permission to delete this post
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
deletePostRouter.delete('/posts/:slug', authJWT, deletePostsController)
    

export default deletePostRouter;