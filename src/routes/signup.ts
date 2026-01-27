import { Router } from "express";
import bcrypt from 'bcrypt';
import pool from "../database/db.js";
import { signUpSchema } from "../schema.js";



const signUpRouter = Router();

signUpRouter.post('/auth/register', async (req, res) => {
    const signUp = signUpSchema.safeParse(req.body)
    if (signUp.success) {
        try {

        // check that email and username are unique
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [signUp.data.email]
        );

        if (result.rows.length > 0) {
            return res.status(400).json({msg: `${signUp.data.email} already exists`})
        };


        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1', [signUp.data.username]
        );

        if (userResult.rows.length > 0) {
            return res.status(400).json({msg: `${signUp.data.username} already exists`})
        };



        // hashing password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(signUp.data.password, saltRounds);

        const newResult = await pool.query('INSERT INTO users (email, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *', [signUp.data.email, signUp.data.username, hashedPassword, signUp.data.role ])

        const newUser = newResult.rows[0];

        return res.status(201).json({
            msg: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            }
        })
        } catch (err) {
            console.error('Registration Error:', err)
            return res.status(500).json({msg: 'server error'})
        };
    } else {
        return res.status(500).json(signUp.error)
    }
});

export default signUpRouter;



