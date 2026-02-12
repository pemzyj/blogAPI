import 'dotenv/config';

import express from "express";
import pool from './src/database/db.js';
import signUpRouter from './src/routes/signup.js';
import logInRouter from './src/routes/signin.js';
import createPostRouter from './src/routes/createPost.js';
import {getPostByQuery, getPostRouter} from './src/routes/getPost.js';
import updatePostsRouter from './src/routes/updatepost.js';
import deletePostRouter from './src/routes/deletePost.js';
import createCommentRouter from './src/routes/createComments.js';
import getCommentRouter from './src/routes/getComments.js';
import deleteCommentRouter from './src/routes/deleteComments.js';
import getUsersByRoleRouter from './src/routes/getAllUsers.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec  from './swagger.js';



const app = express();



const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', signUpRouter);
app.use('/api/v1', logInRouter);
app.use('/api/v1', createPostRouter);
app.use('/api/v1', getPostRouter);
app.use('/api/v1', getPostByQuery);
app.use('/api/v1', updatePostsRouter);
app.use('/api/v1', deletePostRouter);
app.use('/api/v1', createCommentRouter);
app.use('/api/v1', getCommentRouter);
app.use('/api/v1', deleteCommentRouter);
app.use('/api/v1', getUsersByRoleRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use(notFoundHandler);
app.use(errorHandler);



app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connection successful!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      err: error
    });
  }
});


app.listen (port, async () => {
    console.log(`server connected to port: ${port}`)

    try {
      await pool.query('SELECT NOW()');
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
});

