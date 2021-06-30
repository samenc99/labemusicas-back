import {Request, Response} from "express";
import {UserBusiness} from "../business/UserBusiness";




export class UserController{
  private readonly userBusiness = new UserBusiness()

  signup = async (req: Request, res: Response): Promise<any> => {
    try {
      const token = await this.userBusiness.signup(req.body)
      res.status(200).send({token})
    } catch (err) {
      res.status(err.statusCode || 500).send({message: err.message || 'Internal server error'})
    }
  }

  login = async (req: Request, res: Response): Promise<any> => {
    try {
      const token = await this.userBusiness.login(req.body)
      res.status(200).send({token})
    } catch (err) {
      res.status(err.statusCode || 500).send({message: err.message || 'Internal server error'})
    }
  }
}