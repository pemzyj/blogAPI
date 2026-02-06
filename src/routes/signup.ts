import { Router } from "express";
import signUpController from "../controllers/signUp.js";



const signUpRouter = Router();

/**
 * @swagger
 * /register:
 *    post:
 *        operationId: postNewUsers
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
 *                 username:
 *                     type: string
 *                 password: 
 *                     type: string
 *                 role: 
 *                     type: string
 *                     enum:
 *                       - author
 *                       - admin
 *                       - author 
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

signUpRouter.post('/auth/register', signUpController);

export default signUpRouter;



