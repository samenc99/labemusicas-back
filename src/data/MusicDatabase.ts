import Database from "./Database";

export class MusicDatabase extends Database{
  constructor() {
    super('labemusicas_music');
  }
}