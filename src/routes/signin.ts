import {Router} from 'express';
import signInController from '../controllers/signIn.js';

const logInRouter = Router();

/** 
 * @swagger
 * /auth/login:
 *  post:
      tags:
        - Authentication
      summary: Login user
      description: Authenticate user with email and password. Returns JWT token.
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  example: "user@example.com"
                password:
                  type: string
                  format: password
                  example: "password123"
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Login successful"
                  data:
                    type: object
                    properties:
                      user:
                        type: object
                        properties:
                          id:
                            type: integer
                            example: 5
                          email:
                            type: string
                            example: "user@example.com"
                          username:
                            type: string
                            example: "johndoe"
                          role:
                            type: string
                            example: "author"
                      token:
                        type: string
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        '400':
          description: Missing credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                success: false
                statusCode: 400
                message: "Email and password are required"
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                success: false
                statusCode: 401
                message: "Invalid email or password"
*/

logInRouter.post('/auth/login', signInController);

export default logInRouter;

