import {UserDatabase} from "../data/UserDatabase";
import {UserData, UserDTO, UserLoginDTO} from "../model/User";
import validateEmail from "../services/validateEmail";
import {CustomError} from "../errors/CustomError";
import {HashManager} from "../services/HashManager";
import {IdGenerator} from "../services/IdGenerator";
import {Authenticator,AuthenticationData} from "../services/Authenticator";

type Mock = {
  userDatabase ?: any,
  idGenerator ?: any,
  authenticator ?: any,
  hashManager ?: any
}

export class UserBusiness{
  private readonly userDatabase = new UserDatabase()
  private readonly idGenerator = new IdGenerator()
  private readonly authenticator = new Authenticator()
  private readonly hashManager = new HashManager()

  constructor(mock ?: Mock) {
    if(mock?.userDatabase)this.userDatabase = mock.userDatabase
    if(mock?.hashManager)this.hashManager = mock.hashManager
    if(mock?.authenticator)this.authenticator = mock.authenticator
    if(mock?.idGenerator)this.idGenerator = mock.idGenerator
  }

  signup = async(input : UserDTO):Promise<string>=>{
    try{
      let message = 'Preencha os campos:'
      if(!input.name || typeof input.name!=='string'){
        message+=" 'name'"
      }
      if(!input.nickname || typeof input.nickname!=='string'){
        message+=" 'nickname'"
      }
      if(!validateEmail(input.email)){
        message+=" 'email'"
      }
      if(!input.password || typeof input.password!=='string' || input.password.length<6){
        message+=" 'password'(min 6 characters)"
      }
      if(message.length>19){
        throw new CustomError(400, message)
      }

      const userData : UserData= {
        ...input,
        password: this.hashManager.createHash(input.password),
        id: this.idGenerator.id()
      }

      await this.userDatabase.insertGeneric(userData)
      return this.authenticator.tokenGenerator({id: userData.id})

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

  login = async(input : UserLoginDTO):Promise<string>=>{
    try{
      let message = 'Preencha os campos:'
      let key : string
      if(!input.password || typeof input.password!=="string" || input.password.length<6){
        message+=" 'password'(min 6 characters)"
      }
      if(!input.emailOrNickname || typeof input.emailOrNickname!=="string"){
        message+=" 'email or nickname'"
      }
      if(message.length>19){
        throw new CustomError(400, message)
      }

      if(validateEmail(input.emailOrNickname))key = 'email'
      else key = 'nickname'

      const [user] = await this.userDatabase.selectGeneric(
        ['id', 'password'], {[key]: input.emailOrNickname}
      )

      if(!user){
        throw new CustomError(404, 'E-mail or nickname not found')
      }

      if(!this.hashManager.compareHash(input.password, user.password)){
        throw new CustomError(401, 'Password incorrect')
      }

      return this.authenticator.tokenGenerator({id: user.id})

    }catch (err){
      if(err.sqlMessage){
        throw new CustomError(500, 'Internal server error')
      }
      throw new CustomError(err.statusCode || 500, err.message || 'Internal server error')
    }
  }

}