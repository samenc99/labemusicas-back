import Database from "./Database";

export class UserDatabase extends Database{
  constructor() {
    super('labemusicas_user');
  }
}
