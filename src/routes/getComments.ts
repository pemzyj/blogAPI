import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import getCommentsController from '../controllers/getComments.js';

const getCommentRouter = Router();


/**
 * @swagger
 * /posts/{slug}/comments:
 *    get:
 *      operationId: getAllComments
 *      tags:
 *        - get all comments under a post     
 *        summary: get all comments under a specific post
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
getCommentRouter.get('/posts/:slug/comments', authJWT, getCommentsController);

export default getCommentRouter;