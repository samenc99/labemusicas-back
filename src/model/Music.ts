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
  user_id : string
}

export type GetMusicQuery = {
  title? : string,
  author? : string,
  album? : string
}