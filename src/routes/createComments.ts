import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import createCommentsController from '../controllers/createComment.js';


const createCommentRouter = Router();

createCommentRouter.post('/posts/:slug/comments', authJWT, createCommentsController);

export default createCommentRouter;



