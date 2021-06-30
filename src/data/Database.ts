import knex from "knex";
import dotenv from "dotenv";
dotenv.config()

export default class Database{
  constructor(private readonly tableName : string){}

  protected static connection = knex({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      port: Number(process.env.DB_PORT),
      multipleStatements: true
    }
  })

  public selectGeneric  = (aliases : string[] | string, where={}) => {
    return Database.connection(this.tableName)
      .select(aliases)
      .where(where)
  }

  public insertGeneric = (data : {}) =>{
    return Database.connection(this.tableName)
      .insert(data)
  }

  public deleteGeneric = (where : {})=>{
    return Database.connection(this.tableName)
      .delete()
      .where(where)
  }

  public updateGeneric = (data : {},where : {})=>{
    return Database.connection(this.tableName)
      .update(data)
      .where(where)
  }

}