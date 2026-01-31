import { Request, Response } from 'express';
import pool from '../database/db.js';
import { BadRequestError, ForbiddenError } from '../utils/error.js';
import { asyncErrorHandler } from '../middlewares/errorHandler.js';

const getUsersByRoleController = asyncErrorHandler (async (req: Request, res: Response) => {
        if(req.user?.role !== 'admin') {
            throw new ForbiddenError();
        }
        const {role} = req.query;

         if (!role) {
            const result = await pool.query(
                'SELECT id, email, username, role, created_at FROM users ORDER BY created_at ASC'
            );

            return res.json({
                success: true,
                count: result.rows.length,
                data: result.rows
            });
        }

        const validRoles = ['author','reader', 'admin'];

         if (!validRoles.includes(role as string)) {
            throw new BadRequestError();    
        }

        const result = await pool.query(
            'SELECT id, email, username, role from users WHERE role = $1', [role] 
        );

        return res.json({
            success: true,
            role: role,
            count: result.rows.length,
            data: result.rows
        });
});

export default getUsersByRoleController;