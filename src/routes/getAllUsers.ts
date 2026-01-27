import {Router} from 'express';
import pool from '../database/db.js';
import authJWT from '../middlewares/auth.js';

// get all users
const getUsersByRoleRouter = Router();
getUsersByRoleRouter.get('/users', authJWT, async (req, res) => {
    try{
        if(req.user?.role !== 'admin') {
            return res.status(400).json('Access denied');
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
            return res.status(400).json(`Invalid role. Must be one of: ${validRoles.join(', ')}`);    
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

        

    } catch (err) {
        console.error('User doesn\'t exist', err);
        return res.status(500).json('Server error')
    }
    

});

export default getUsersByRoleRouter;