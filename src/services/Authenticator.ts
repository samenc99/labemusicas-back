import { sign, verify } from "jsonwebtoken";
import {CustomError} from "../errors/CustomError";

export type AuthenticationData = {
  id : string
}

export class Authenticator{
  tokenGenerator = (payload: AuthenticationData) : string=> {
    return sign(payload, process.env.JWT_KEY!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
  };

  tokenValidate = (token:string):AuthenticationData => {
    try{
      return verify(
        token,
        String(process.env.JWT_KEY)
      ) as AuthenticationData
    }catch (err){
      if(err.message.includes('jwt expired')){
        throw new CustomError(401, 'Token expired')
      }
      else if(err.message.includes('jwt invalid')){
        throw new CustomError(400, 'Token invalid')
      }
      throw new CustomError(400, 'Token error, please try again')
    }
  }
}