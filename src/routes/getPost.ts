import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import { getPostsByQueryController, getPostsController } from '../controllers/getPosts.js';


export const getPostRouter = Router();
//get posts using slug
getPostRouter.get('/posts/:slug', authJWT, getPostsController);


//get all posts and posts by author name
export const getPostByQuery = Router();
getPostByQuery.get('/posts', authJWT, getPostsByQueryController); 

