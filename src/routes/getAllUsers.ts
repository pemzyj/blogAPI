import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import getUsersByRoleController from '../controllers/getAllUsers.js';


const getUsersByRoleRouter = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     operationId: getAllUsers
 *     summary: admin dashboard to get all users by role and get all users if no role is specified
 *     description: >
 *     parameters: 
 *       - name: role
 *         in: query
 *         description: user role
 *         required: false
 *         schema: 
 *           type: string
 *           enum:
 *             - reader
 *             - author
 *         example: /users?role=reader    
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       email:
 *                         type: string
 *                         example: user@example.com
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       role:
 *                         type: string
 *                         example: author
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-01-15T10:30:00Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10  
 *       401:
 *         description: Unauthorized - Not authenticated
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
 *                   example: Not authenticated. Please login.
 *       403:
 *         description: Forbidden - Not an admin
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
 *                   example: Access denied. Admin privileges required.
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
 *          
 * 
 */
getUsersByRoleRouter.get('/users', authJWT, getUsersByRoleController);

export default getUsersByRoleRouter;