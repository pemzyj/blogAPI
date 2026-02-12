import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import createPostsController from '../controllers/createPosts.js';

const createPostRouter = Router();


/**
 * @swagger
 * /create:
 *   post:
 *     operationId: createNewPosts
 *     summary: create new post
 *     description: >
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
 *               status: 
 *                 type: string
 *                 default: draft  
 *     responses:    
 *       201:
 *         description: Post created successfully
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
 *                   example: Post created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: My First Blog Post
 *                     slug:
 *                       type: string
 *                       example: my-first-blog-post
 *                     content:
 *                       type: string
 *                       example: This is the content of my blog post...
 *                     status:
 *                       type: string
 *                       example: draft
 *                     authorId:
 *                       type: integer
 *                       example: 1
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
 *                   example: Title and content are required
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
 */
createPostRouter.post('/create', authJWT, createPostsController);

export default createPostRouter;