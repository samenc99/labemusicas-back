export class HashManagerMock{
  createHash = (plainText: string):string=>{
    return plainText
  }
  compareHash = (plainText : string, cypherText : string) : boolean=>{
    return plainText === cypherText
  }
}