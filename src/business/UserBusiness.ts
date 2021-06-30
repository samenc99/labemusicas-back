import {UserDatabase} from "../data/UserDatabase";
import {UserData, UserDTO} from "../model/User";
import validateEmail from "../services/validateEmail";
import {CustomError} from "../errors/CustomError";
import {HashManager} from "../services/HashManager";
import {IdGenerator} from "../services/IdGenerator";
import {Authenticator,AuthenticationData} from "../services/Authenticator";

export class UserBusiness{
  private userDatabase = new UserDatabase()
  private idGenerator = new IdGenerator().id()
  private tokenGenerator = (payload : AuthenticationData)=> new Authenticator().tokenGenerator(payload)
  private hashManager = new HashManager()

  login = async(
    input : UserDTO,
    userDatabase?:any,
    idGenerator?: any,
    tokenGenerator?:any,
    hashManager?:any
  ):Promise<string>=>{
    if(userDatabase)this.userDatabase = userDatabase
    if(idGenerator)this.idGenerator = idGenerator
    if(tokenGenerator)this.tokenGenerator = tokenGenerator
    if(hashManager)this.hashManager = hashManager
    try{
      let message = 'Preencha os campos: '
      if(!input.name || typeof input.name!=='string'){
        message+="'name' "
      }
      if(!input.nickname || typeof input.nickname!=='string'){
        message+="'nickname' "
      }
      if(!validateEmail(input.email)){
        message+="'email' "
      }
      if(!input.password || typeof input.password!=='string' || input.password.length<6){
        message+="'password'(min 6 characters) "
      }
      if(message.length>20){
        throw new CustomError(400, message)
      }

      const userData : UserData= {
        ...input,
        password: this.hashManager.createHash(input.password),
        id: this.idGenerator
      }

      await this.userDatabase.insertGeneric(userData)
      return this.tokenGenerator({id: userData.id})

    }catch (err){
      if(err.sqlMessage?.includes('Duplicate entry')){
        throw new CustomError(409, 'E-mail or nickname already used.')
      }
      if(err.sqlMessage){
        throw new CustomError(500, 'Internal server error.')
      }
      throw new CustomError(
        err.statusCode || 500,
        err.message || 'Internal server error.'
      )
    }
  }
}