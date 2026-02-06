import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import deletePostsController from '../controllers/deletePost.js';

const deletePostRouter = Router();



/**
 * @swagger
 * /posts/{slug}:
 *    post:
 *        operationId: deletePosts
 *        summary: delete specified post using the post slug
 *        description: >
 *        parameters: 
 *          - name: slug
 *            in: path
 *            description: post's slug
 *            required: true
 *            schema: 
 *              type: string
 *          responses: 
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
deletePostRouter.delete('/posts/:slug', authJWT, deletePostsController)
    

export default deletePostRouter;