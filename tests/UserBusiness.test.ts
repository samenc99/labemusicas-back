import {UserBusiness} from "../src/business/UserBusiness";
import {DatabaseMock} from "./mocks/DatabaseMock";
import {IdGeneratorMock} from "./mocks/IdGeneratorMock";
import {AuthenticatorMock} from "./mocks/AuthenticatorMock";
import {HashManagerMock} from "./mocks/HashManagerMock";
import {UserDTO} from "../src/model/User";

const userBusiness = new UserBusiness(
  {
    userDatabase: new DatabaseMock(),
    idGenerator : new IdGeneratorMock(),
    authenticator : new AuthenticatorMock(),
    hashManager : new HashManagerMock()
  }
)

describe('UserBusiness',()=>{
  describe('login',()=>{
    const input : UserDTO = {
      name : 'samuel',
      password : '123456',
      email : 'sam@gmail.com',
      nickname : 'samenc'
    }
    let message = 'Preencha os campos: '

    test('Error name', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...input, name:''})
      }catch (err){
        expect(err.message).toBe(message+"'name' ")
      }
    })
    test('Error password', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...input, password:'12345'})
      }catch (err){
        expect(err.message).toBe(message+"'password'(min 6 characters)")
      }
    })
    test('Error nickname', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...input, nickname:''})
      }catch (err){
        expect(err.message).toBe(message+"'nickname' ")
      }
    })
    test('Error email', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...input, email:'sam@gm'})
      }catch (err){
        expect(err.message).toBe(message+"'email' ")
      }
    })
    test('Success', async()=>{
      expect.assertions(1)
      try{
        const token = await userBusiness.login(input)
        expect(token).toBe('token_mock')
      }catch (err){
        console.log(err.message)
      }
    })
  })
})