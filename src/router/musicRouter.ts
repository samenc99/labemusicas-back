import {Router} from "express";
import {MusicController} from "../controller/MusicController";

const musicRouter = Router()
export default musicRouter

const musicController = new MusicController()

musicRouter.post('/', musicController.createMusic)
musicRouter.get('/', musicController.getMusics)
musicRouter.get('/albums', musicController.getAlbums)
musicRouter.get('/all', musicController.getMusicsAllUsers)
musicRouter.get('/:id/all',musicController.getMusicAllUsers)
musicRouter.get('/:id', musicController.getMusic)
musicRouter.delete('/', musicController.deleteMusics)