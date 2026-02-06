import {Router} from 'express';
import signInController from '../controllers/signIn.js';

const logInRouter = Router();

/**
 * @swagger
 * /login:
 *    post:
 *        operationId: loginUsers
 *        summary: register users
 *        description: >
 *        requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 email:
 *                     type: string
 *                 password: 
 *                     type: string
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

logInRouter.post('/auth/login', signInController);

export default logInRouter;

