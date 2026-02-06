import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import getUsersByRoleController from '../controllers/getAllUsers.js';


const getUsersByRoleRouter = Router();

/**
 * @swagger
 * /users:
 *    get:
 *        operationId: getAllUsers
 *        summary: admin dashboard to get all users by role and get all users if no role is specified
 *        description: >
 *        parameters: 
 *          - name: role
 *            in: query
 *            description: user role
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
getUsersByRoleRouter.get('/users', authJWT, getUsersByRoleController);

export default getUsersByRoleRouter;