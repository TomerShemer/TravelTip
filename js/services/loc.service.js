import { controller } from '../app.controller.js';
import { util } from './utils.service.js'


export const locService = {
    getLocs,
    setNewLoc,
}

const locs = [
    { id: util.makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: util.makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        resolve(locs)
        // }, 2000)
    })
}

function setNewLoc(lat, lng) {
    ev.preventDefault()
    locs.push({
        name: prompt('Enter name for location'),
        lat: lat,
        lng: lng,
    })
    controller.onGetLocs()
    controller.onGoToLoc(lat, lng)
}
