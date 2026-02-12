import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import updatePostController from '../controllers/updatePost.js';

const updatePostsRouter = Router();


/**
 * @swagger
 * /posts/{slug}:
 *   post:
 *     operationId: updateExistingPosts
 *     summary: update existing users
 *     description: >
 *     parameters: 
 *       - name: slug
 *         in: path
 *         description: post's slug
 *         required: true
 *         schema: 
 *           type: string
 *         example: /posts/my-article-title  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *                 minLength: 2  
 *     responses:
 *       200:
 *         description: Post updated successfully
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
 *                   example: Post updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Updated Blog Post Title
 *                     slug:
 *                       type: string
 *                       example: updated-blog-post-title
 *                     content:
 *                       type: string
 *                       example: This is the updated content...
 *                     status:
 *                       type: string
 *                       example: published
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T14:30:00Z
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
 *                   example: At least one field must be provided for update
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
 *         description: Forbidden - Not the post author
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
 *                   example: You do not have permission to update this post
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
updatePostsRouter.put('/posts/:slug', authJWT, updatePostController);

export default updatePostsRouter;