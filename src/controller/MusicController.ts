import {Request, Response} from "express";
import {MusicBusiness} from "../business/MusicBusiness";

export class MusicController {
  private readonly musicBusiness = new MusicBusiness()

  createMusic = async (req: Request, res: Response): Promise<any> => {
    try {
      await this.musicBusiness.createMusic(req.body, req.headers.authorization)
      res.status(201).send()
    } catch (err) {
      res.status(err.statusCode).send({message: err.message})
    }
  }

  getMusics = async (req: Request, res: Response): Promise<any> => {
    try {
      const musics = await this.musicBusiness.getMusics(req.headers.authorization)
      res.status(200).send({musics})
    } catch (err) {
      res.status(err.statusCode).send({message: err.message})
    }
  }

  getMusic = async (req: Request, res: Response): Promise<any> => {
    try {
      const music = await this.musicBusiness.getMusic(req.headers.authorization, req.params.id)
      res.status(200).send({music})
    } catch (err) {
      res.status(err.statusCode).send({message: err.message})
    }
  }

  deleteMusic = async (req: Request, res: Response): Promise<any> => {
    try {
      await this.musicBusiness.deleteMusic(req.headers.authorization, req.params.id)
      res.status(200).send()
    } catch (err) {
      res.status(err.statusCode).send({message: err.message})
    }
  }

}



