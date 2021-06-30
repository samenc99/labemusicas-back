import {UserBusiness} from "../src/business/UserBusiness";
import {DatabaseMock} from "./mocks/DatabaseMock";
import {IdGeneratorMock} from "./mocks/IdGeneratorMock";
import {AuthenticatorMock} from "./mocks/AuthenticatorMock";
import {HashManagerMock} from "./mocks/HashManagerMock";
import {UserDTO, UserLoginDTO} from "../src/model/User";
import {UserDatabaseMock} from "./mocks/UserDatabaseMock";

const userBusiness = new UserBusiness(
  {
    userDatabase: new UserDatabaseMock(),
    idGenerator : new IdGeneratorMock(),
    authenticator : new AuthenticatorMock(),
    hashManager : new HashManagerMock()
  }
)

describe('UserBusiness',()=>{
  describe('signup',()=>{
    const input : UserDTO = {
      name : 'samuel',
      password : '123456',
      email : 'sam@gmail.com',
      nickname : 'samenc'
    }
    let message = 'Preencha os campos:'

    test('Error name', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.signup({...input, name:''})
      }catch (err){
        expect(err.message).toBe(message+" 'name'")
      }
    })
    test('Error password', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.signup({...input, password:'12345'})
      }catch (err){
        expect(err.message).toBe(message+" 'password'(min 6 characters)")
      }
    })
    test('Error nickname', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.signup({...input, nickname:''})
      }catch (err){
        expect(err.message).toBe(message+" 'nickname'")
      }
    })
    test('Error email', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.signup({...input, email:'sam@gm'})
      }catch (err){
        expect(err.message).toBe(message+" 'email'")
      }
    })
    test('Success', async()=>{
      expect.assertions(1)
      try{
        const token = await userBusiness.signup(input)
        expect(token).toBe('token_mock')
      }catch (err){
        console.log(err.message)
      }
    })
  })
  describe('login', ()=>{
    const inputEmail : UserLoginDTO = {
      emailOrNickname : 'email_mock@email.com',
      password : 'password_mock'
    }
    const inputNickname : UserLoginDTO = {
      emailOrNickname : 'nickname_mock',
      password : 'password_mock'
    }
    let message = 'Preencha os campos:'

    test('Email or nickname error', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...inputEmail, emailOrNickname:''})
      }catch (err){
        expect(err.message).toBe(message+" 'emailOrNickname'")
      }
    })

    test('Password error min 6 characters', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...inputEmail, password:'1234'})
      }catch (err){
        expect(err.message).toBe(message+" 'password'(min 6 characters)")
      }
    })

    test('User not found', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...inputEmail, emailOrNickname:'blabla'})
      }catch (err){
        expect(err.message).toBe('E-mail or nickname not found')
      }
    })

    test('Password incorrect', async()=>{
      expect.assertions(1)
      try{
        await userBusiness.login({...inputEmail, password:'123456'})
      }catch (err){
        expect(err.message).toBe('Password incorrect')
      }
    })

    test('Successful with nickname', async()=>{
      const token = await userBusiness.login(inputNickname)
      expect(token).toBe('token_mock')
    })

    test('Successful with email', async()=>{
      const token = await userBusiness.login(inputEmail)
      expect(token).toBe('token_mock')
    })

  })
})