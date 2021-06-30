import { v4 as uuid} from 'uuid'

export class IdGenerator{
    id = ():string => {
        return uuid()
    }
}