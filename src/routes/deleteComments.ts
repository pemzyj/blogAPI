import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import deleteCommentsController from '../controllers/deleteComments.js';


const deleteCommentRouter = Router();

/**
 * @swagger
 * /comments/{id}:
 *    post:
 *        operationId: deleteComments
 *        summary: delete comments 
 *        description: >
 *        parameters: 
 *          - name: id
 *            in: path
 *            description: comment id
 *            required: true
 *            schema: 
 *              type: integer
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
deleteCommentRouter.delete('/comments/:id', authJWT, deleteCommentsController); 

export default deleteCommentRouter;