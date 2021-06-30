import {AuthenticationData} from "../../src/services/Authenticator";

export class AuthenticatorMock {
  tokenGenerator = (payload : AuthenticationData)=>{
    return 'token_mock'
  }

  tokenValidate = (token:string):AuthenticationData=>{
    return {
      id : 'id_mock'
    }
  }
}