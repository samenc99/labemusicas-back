export type MusicData = {
  id : string,
  title : string,
  author : string,
  date : Date,
  file : string,
  album : string,
  genre : string,
  user_id : string
}

export type MusicDTO = {
  title : any,
  author : any,
  date : any,
  file : any,
  album : any,
  genre : any
}

export type Music = {
  id : string,
  title : string,
  author : string,
  date : Date,
  file : string,
  album : string,
  genre : string[],
  userId : string
}

export type ShortMusic = {
  id : string,
  title : string,
  author : string,
  album : string
}

export type GetMusicQuery = {
  title? : string,
  author? : string,
  album? : string
}

export const musicDataToMusic = (musicData : MusicData):Music=>{
  return {
    genre : JSON.parse(musicData.genre),
    userId : musicData.user_id,
    album : musicData.album,
    author: musicData.author,
    date: musicData.date,
    title: musicData.title,
    id: musicData.id,
    file: musicData.file
  }
}
