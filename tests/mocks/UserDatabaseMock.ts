export class UserDatabaseMock {
  public selectGeneric  = (aliases : string[] | string, where={}) => {
    let found : boolean = false
    //@ts-ignore
    if(where.email){
    // @ts-ignore
      found = where.email === 'email_mock@email.com'
    }
    // @ts-ignore
    else if(where.nickname){
      // @ts-ignore
      found = where.nickname === 'nickname_mock'
    }
    if(found){
      return [{
        id: 'id_mock',
        password: 'password_mock'
      }]
    }
    else return [undefined]

  }
  public insertGeneric = (data : {}) =>{
    return
  }
  public deleteGeneric = (where : {})=>{
    return
  }
  public updateGeneric = (data : {},where : {})=>{
    return
  }
}