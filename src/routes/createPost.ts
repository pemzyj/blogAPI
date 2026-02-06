import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import createPostsController from '../controllers/createPosts.js';

const createPostRouter = Router();


/**
 * @swagger
 * /create:
 *    post:
 *        operationId: createNewPosts
 *        summary: create new post
 *        description: >
 *        requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 title:
 *                     type: string
 *                 content:
 *                     type: string
 *                 status: 
 *                     type: string
 *                     default: draft
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
createPostRouter.post('/create', authJWT, createPostsController);

export default createPostRouter;