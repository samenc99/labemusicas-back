import {MusicBusiness} from "../src/business/MusicBusiness";
import {MusicDatabaseMock} from "./mocks/MusicDatabaseMock";
import {IdGeneratorMock} from "./mocks/IdGeneratorMock";
import {AuthenticatorMock} from "./mocks/AuthenticatorMock";
import {MusicDTO} from "../src/model/Music";

const musicBusiness = new MusicBusiness({
  musicDatabase : new MusicDatabaseMock(),
  idGenerator : new IdGeneratorMock(),
  authenticator : new AuthenticatorMock()
})

describe('MusicBusiness', ()=>{
  describe('createMusic', ()=>{
    const input : MusicDTO = {
      title: 'musica a',
      file: 'link_music',
      album: 'album da musica a',
      date: new Date(),
      author: 'eu mesmo',
      genre: ['genero 1', 'genero 2']
    }

    let message = 'Preencha os campos:'

    test('Successful', async()=>{
      expect.assertions(0)
      try{
        await musicBusiness.createMusic(input, 'token_mock')
      }catch (err){
        expect(err).toBe(err)
        console.log({message: err.message})
      }
    })

    test('Error all', async()=>{
      expect.assertions(1)
      try {
        //@ts-ignore
        await musicBusiness.createMusic({}, 'token_mock')
      }catch (err){
        expect(err.message).toBe(message +
          " 'title' 'name' 'album' 'file' 'genre'")
      }
    })

    test('Error genre array', async()=>{
      expect.assertions(1)
      try{
        await musicBusiness.createMusic({...input, genre: 'sa'}, 'token_mock')
      }catch (err){
        expect(err.message).toBe(message + " 'genre'")
      }
    })

    test('Error genre string array', async()=>{
      expect.assertions(1)
      try {
        await musicBusiness.createMusic({...input, genre: ['test', 'oto', 5]}, 'token_mock')
      }catch (err){
        expect(err.message).toBe('Gender is required as string array')
      }
    })

  })
})