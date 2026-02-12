import { Router } from "express";
import signUpController from "../controllers/signUp.js";



const signUpRouter = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     operationId: postNewUsers
 *     summary: register users
 *     description: >
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               email:
 *                   type: string
 *                   format: email
 *               username:
 *                   type: string
 *                   minLength: 2
 *               password: 
 *                   type: string
 *                   minLength: 8
 *                   format: password
 *               role: 
 *                   type: string
 *                   enum:
 *                     - author
 *                     - admin
 *                     - author 
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     role:
 *                       type: string
 *                       example: author
 *       400:
 *         description: Bad request - Invalid input data
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
 *                   example: Invalid input data
 *       409:
 *         description: Conflict - Email or username already exists
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
 *                   example: Email already registered
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

signUpRouter.post('/auth/register', signUpController);

export default signUpRouter;



