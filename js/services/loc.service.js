import { controller } from '../app.controller.js';
import { storageService } from './services/storage.service'

export const locService = {
    getLocs,
    setNewLoc,
}

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function setNewLoc(lat, lng) {
    locs.push({
        name: prompt('Enter name for location'),
        lat: lat,
        lng: lng,
    })
    controller.onGetLocs()
    controller.onGoToLoc(lat, lng)
    storageService.save()
}
