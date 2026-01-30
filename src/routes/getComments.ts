import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import getCommentsController from '../controllers/getComments.js';

const getCommentRouter = Router();

getCommentRouter.get('/posts/:slug/comments', authJWT, getCommentsController);

export default getCommentRouter;