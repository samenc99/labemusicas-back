import {MusicDatabase} from "../data/MusicDatabase";
import {GetMusicQuery, Music, MusicData, MusicDTO} from "../model/Music";
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
      throw new CustomError(err.statusCode || 500, err.message)
    }
  }

  getMusics = async(token : any, query : GetMusicQuery):Promise<Music[]>=>{
    try{
      const payload = this.authenticator.tokenValidate(token)
      query.album = query.album || ''
      query.author = query.author || ''
      query.title = query.title || ''
      const musicsData = await this.musicDatabase
        .selectGeneric('*', {user_id:payload.id})
        .where('album', 'like', `%${query.album}%`)
        .andWhere('author', 'like', `%${query.author}%`)
        .andWhere('title', 'like', `%${query.title}%`)
      if(musicsData.length===0){
        throw new CustomError(404, "Songs not found")
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
      throw new CustomError(err.statusCode || 500, err.message)
    }
  }

  getMusic = async(token : any, id : any):Promise<Music>=>{
    try{
      const payload = this.authenticator.tokenValidate(token)
      if(!id || typeof id !=="string"){
        throw new CustomError(400, 'Id is required')
      }
      const [musicData] = await this.musicDatabase.selectGeneric(
        '*', {id: id, user_id: payload.id}
      )
      if(!musicData){
        throw new CustomError(404,'Music not found')
      }
      return {
        ...musicData,
        genre : JSON.parse(musicData.genre)
      }
    }catch (err){
      if(err.sqlMessage){
        throw new CustomError(500, 'Internal server error')
      }
      throw new CustomError(err.statusCode || 500, err.message)
    }
  }

  deleteMusics = async(token : any, ids : any):Promise<void>=>{
    try{
      const payload = this.authenticator.tokenValidate(token)
      if(!ids || !Array.isArray(ids)){
        throw new CustomError(400, 'Ids(array) is required')
      }
      for(const id of ids){
        if(typeof id !=='string'){
          throw new CustomError(400, 'Ids is required as string array')
        }
      }

      for(const id of ids){
        await this.musicDatabase.deleteGeneric({id:id, user_id:payload.id})
      }

    }catch (err){
      if(err.sqlMessage){
        throw new CustomError(500, 'Internal server error')
      }
      throw new CustomError(err.statusCode || 500, err.message)
    }
  }

}