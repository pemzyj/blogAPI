import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import deleteCommentsController from '../controllers/deleteComments.js';


const deleteCommentRouter = Router();

deleteCommentRouter.delete('/comments/:id', authJWT, deleteCommentsController); 

export default deleteCommentRouter;