import { Request, Response } from "express";
import pool from "../database/db.js";
import jwt from 'jsonwebtoken';
import { signInSchema } from '../schema.js';
import bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError } from "../utils/error.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const signInController = asyncHandler(async (req: Request,res: Response)=> {
    const signIn = signInSchema.safeParse(req.body);
    if(signIn.success) {
            // ensure email and password exists
            if (!signIn.data.email) {
                throw new BadRequestError('email is required');
            }

            if (!signIn.data.password) {
                throw new BadRequestError('password is required');
            }

            //check user exist
            const existingUser = await pool.query(
                'SELECT id, email, password_hash, username, role FROM users WHERE email = $1', [signIn.data.email]
            )

            if (existingUser.rows.length === 0) {
                throw new NotFoundError('Please signup');
            }

            const user = existingUser.rows[0];


            if(!user.password_hash) {
                throw new NotFoundError('Password doesn\'t exists');
            };
            


            // validate password
            const isMatch = await bcrypt.compare(signIn.data.password, user.password_hash);

            if (!isMatch) {
                throw new BadRequestError('Invalid email or password');
            }

            
            const JWTSecretKey = 'AuthorizationSecretKey';

            const payload = {
                role: user.role,
                id: user.id,
                username: user.username,
                email: user.email
            };

            const token = jwt.sign(payload, JWTSecretKey, {expiresIn: '1h'});



            return res.status(200).json({
                msg: 'user logged in successfully',
                role: user.role,
                token
            }); 
    } else {
        return res.status(500).json(signIn.error)
    }
    
});

export default signInController;