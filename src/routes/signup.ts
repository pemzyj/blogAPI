import { Router } from "express";
import signUpController from "../controllers/signUp.js";



const signUpRouter = Router();



signUpRouter.post('/auth/register', signUpController);

export default signUpRouter;



