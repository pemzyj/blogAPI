import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import { getPostsByQueryController, getPostsController } from '../controllers/getPosts.js';


export const getPostRouter = Router();
//get posts using slug

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: get a particular post
 *     responses: 
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *                       example: published
 *                     authorId:
 *                       type: integer
 *                       example: 1
 *                     author:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: johndoe
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
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
 */
getPostRouter.get('/posts/:slug', authJWT, getPostsController);


//get all posts and posts by author name
export const getPostByQuery = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     operationId: getPostsByAuthor
 *     tags:
 *       - All posts by an author
 *     summary: get posts by a particular author or get all posts if author is not specified
 *     description: >
 *     parameters: 
 *       - name: author
 *         in: query
 *         description: Author name
 *         required: false
 *         schema: 
 *           type: string
 *         example: /posts?role=author
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
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
 *                       title:
 *                         type: string
 *                         example: My First Blog Post
 *                       slug:
 *                         type: string
 *                         example: my-first-blog-post
 *                       content:
 *                         type: string
 *                         example: This is the content...
 *                       status:
 *                         type: string
 *                         example: published
 *                       authorId:
 *                         type: integer
 *                         example: 1
 *                       author:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             example: johndoe
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-01-15T10:30:00Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
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
getPostByQuery.get('/posts', authJWT, getPostsByQueryController); 

