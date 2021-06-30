import {Router} from "express";
import {UserController} from "../controller/UserController";

const userRouter = Router()
export default userRouter

const userController = new UserController()

userRouter.post('/signup', userController.signup)
userRouter.post('/login', userController.login)