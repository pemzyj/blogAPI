import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import updatePostController from '../controllers/updatePost.js';

const updatePostsRouter = Router();

updatePostsRouter.put('/posts/:slug', authJWT, updatePostController);

export default updatePostsRouter;