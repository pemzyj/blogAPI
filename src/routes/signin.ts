import {Router} from 'express';
import signInController from '../controllers/signIn.js';

const logInRouter = Router();

logInRouter.post('/auth/login', signInController);

export default logInRouter;

