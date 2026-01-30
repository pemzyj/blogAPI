import { Request, Response } from "express";
import pool from "../database/db.js";
import jwt from 'jsonwebtoken';
import { signInSchema } from '../schema.js';
import bcrypt from 'bcrypt';


const signInController = async (req: Request,res: Response)=> {
    const signIn = signInSchema.safeParse(req.body);
    if(signIn.success) {
        try {
            // ensure email and password exists
            if (!signIn.data.email) {
                return res.status(401).json({msg: 'email is required'})
            };

            if (!signIn.data.password) {
                return res.status(401).json({msg: 'password is required'})
            };

            //check user exist
            const existingUser = await pool.query(
                'SELECT id, email, password_hash, username, role FROM users WHERE email = $1', [signIn.data.email]
            );

            if (existingUser.rows.length === 0) {
                return res.status(401).json({
                    err: 'user doesn\'t exist',
                    msg: 'Please signup'
                })
            };

            const user = existingUser.rows[0];


            if(!user.password_hash) {
                return res.status(401).json({msg: "Password doesn\'t exist"})
            };
            


            // validate password
            const isMatch = await bcrypt.compare(signIn.data.password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({
                    msg: 'invalid email or password'
                })
            };

            
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
        }catch(err) {
            console.error('Unable to Login', err);
            return res.status(500).json('Server error')
        }
    } else {
        return res.status(500).json(signIn.error)
    }
    
};

export default signInController;