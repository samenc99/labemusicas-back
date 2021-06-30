import { sign, verify } from "jsonwebtoken";

export type AuthenticationData = {
  id : string
}

export class Authenticator{
  tokenGenerator = (payload: AuthenticationData) => {
    return sign(payload, process.env.JWT_KEY!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
  };

  tokenValidate = (token:string):AuthenticationData => {
    return verify(
      token,
      String(process.env.JWT_KEY)
    ) as AuthenticationData
  }
}