import {Router} from 'express';
import authJWT from '../middlewares/auth.js';
import getUsersByRoleController from '../controllers/getAllUsers.js';


const getUsersByRoleRouter = Router();
getUsersByRoleRouter.get('/users', authJWT, getUsersByRoleController);

export default getUsersByRoleRouter;