import {Router} from "express";
import {MusicController} from "../controller/MusicController";

const musicRouter = Router()
export default musicRouter

const musicController = new MusicController()

musicRouter.post('/', musicController.createMusic)
musicRouter.get('/', musicController.getMusics)
musicRouter.get('/:id', musicController.getMusic)