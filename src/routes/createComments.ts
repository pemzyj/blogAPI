import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import createCommentsController from '../controllers/createComment.js';


const createCommentRouter = Router();

/**
 * @swagger
 * /posts/{slug}/comments:
 *    post:
 *        operationId: createComments
 *        summary: write comments under a particular post or comment
 *        description: >
 *        parameters: 
 *          - name: slug
 *            in: path
 *            description: post slug
 *            required: true
 *            schema: 
 *              type: string
 *        requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 content:
 *                     type: string
 *                 parentId:
 *                     type: integer
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
createCommentRouter.post('/posts/:slug/comments', authJWT, createCommentsController);

export default createCommentRouter;



