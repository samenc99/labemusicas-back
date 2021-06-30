export class DatabaseMock {
  public selectGeneric  = (aliases : string[] | string, where={}) => {
    return ['1','2']
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