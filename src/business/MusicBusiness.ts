import {MusicDatabase} from "../data/MusicDatabase";
import {Music, MusicData, MusicDTO} from "../model/Music";
import {IdGenerator} from "../services/IdGenerator";
import {Authenticator} from "../services/Authenticator";
import {CustomError} from "../errors/CustomError";

type Mock = {
  musicDatabase ?: any,
  idGenerator ?: any,
  authenticator ?: any,
}

export class MusicBusiness{
  private readonly musicDatabase = new MusicDatabase()
  private readonly idGenerator = new IdGenerator()
  private readonly authenticator = new Authenticator()

  constructor(mock ?: Mock) {
    if(mock?.musicDatabase)this.musicDatabase = mock.musicDatabase
    if(mock?.authenticator)this.authenticator = mock.authenticator
    if(mock?.idGenerator)this.idGenerator = mock.idGenerator
  }

  createMusic = async(input : MusicDTO, token : any):Promise<void>=>{
    try{
      let message = 'Preencha os campos:'
      const payload = this.authenticator.tokenValidate(token)
      if(!input.title || typeof input.title!=='string'){
        message+=" 'title'"
      }
      if(!input.author || typeof input.author!== 'string'){
        message+=" 'name'"
      }
      if(!input.date || isNaN(input.date)){
        input.date = new Date()
      }
      if(!input.album || typeof input.album!=='string'){
        message+=" 'album'"
      }
      if(!input.file || typeof input.file!=='string'){
        message+=" 'file'"
      }
      if(!input.genre || !Array.isArray(input.genre)){
        message+=" 'genre'"
      }
      if(message.length>19){
        throw new CustomError(400, message)
      }
      for(const g of input.genre){
        if(typeof g !=='string'){
          throw new CustomError(400, 'Gender is required as string array')
        }
      }
      const musicData : MusicData = {
        id : this.idGenerator.id(),
        user_id : payload.id,
        ...input,
        genre : JSON.stringify(input.genre)
      }

      await this.musicDatabase.insertGeneric(musicData)

    }catch (err){
      if(err.sqlMessage){
        throw new CustomError(500, 'Internal server error')
      }
      else if(err.message.includes('jwt expired')){
        throw new CustomError(401, 'Token expired')
      }
      else if(err.message.includes('jwt invalid')){
        throw new CustomError(400, 'Token invalid')
      }
      else if(err.message.includes('jwt')){
        throw new CustomError(400, 'Token error, please try again')
      }
      throw new CustomError(err.statusCode || 500, err.message)
    }
  }

  getMusics = async(token : any, id?: any):Promise<Music[]>=>{
    try{
      const payload = this.authenticator.tokenValidate(token)
      const musicsData = await this.musicDatabase.selectGeneric('*', {user_id:payload.id})
      if(musicsData.length===0){
        throw new CustomError(404, "User doesn't have songs")
      }

      return musicsData.map(musicData =>{
        return{
          ...musicData,
          genre : JSON.parse(musicData.genre)
        }
      })

    }catch (err){
      if(err.sqlMessage){
        throw new CustomError(500, 'Internal server error')
      }
      else if(err.message.includes('jwt expired')){
        throw new CustomError(401, 'Token expired')
      }
      else if(err.message.includes('jwt invalid')){
        throw new CustomError(400, 'Token invalid')
      }
      else if(err.message.includes('jwt')){
        throw new CustomError(400, 'Token error, please try again')
      }
      throw new CustomError(err.statusCode || 500, err.message)
    }
  }

}