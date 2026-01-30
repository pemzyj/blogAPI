import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import createPostsController from '../controllers/createPosts.js';

const createPostRouter = Router();



createPostRouter.post('/create', authJWT, createPostsController);

export default createPostRouter;