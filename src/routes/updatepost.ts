import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import updatePostController from '../controllers/updatePost.js';

const updatePostsRouter = Router();


/**
 * @swagger
 * /posts/{slug}:
 *    post:
 *        operationId: updateExistingPosts
 *        summary: update existing users
 *        description: >
 *        parameters: 
 *          - name: slug
 *            in: path
 *            description: post's slug
 *            required: true
 *            schema: 
 *              type: string
 *            example: /posts/my-article-title
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  title:
 *                      type: string
 *                  content:
 *                      type: string
 * 
 *       responses: 
 *              "200":
 *                 description:
 *                 content: 
 *                      application/json:
 *                          schema: 
 *                            type: object
 *                            properties: 
 *                              email:
 *                                  type: 
 *                              password: 
 *                                  type:
 *                              username:
 *                                  type:
 *                              role:
 *                                  type:
 * 
 */
updatePostsRouter.put('/posts/:slug', authJWT, updatePostController);

export default updatePostsRouter;