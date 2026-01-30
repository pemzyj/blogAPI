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



const app = express();

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', signUpRouter);
app.use('/api', logInRouter);
app.use('/api', createPostRouter);
app.use('/api', getPostRouter);
app.use('/api', getPostByQuery);
app.use('/api', updatePostsRouter);
app.use('/api', deletePostRouter);
app.use('/api', createCommentRouter);
app.use('/api', getCommentRouter);
app.use('/api', deleteCommentRouter);
app.use('/api', getUsersByRoleRouter);







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
      console.log('✅ Database connected');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
});

