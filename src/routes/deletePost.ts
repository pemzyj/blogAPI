import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import deletePostsController from '../controllers/deletePost.js';

const deletePostRouter = Router();




deletePostRouter.delete('/posts/:slug', authJWT, deletePostsController)
    

export default deletePostRouter;