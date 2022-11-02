import { controller } from '../app.controller.js';
import { util } from './utils.service.js'
import { storageService } from './storage.service.js';
import { mapService } from './map.service.js';


export const locService = {
    getLocs,
    setNewLoc,
    deleteLoc,
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
    const name = prompt('Enter name for location')
    if (!name) return
    locs.push({
        name,
        lat,
        lng,
    })
    mapService.addMarker({ lat, lng })
    controller.onGetLocs()
    controller.onGoToLoc(lat, lng)
    storageService.save()
}

function deleteLoc(id) {
    let locIdx = -1
    locs.filter((loc, idx) => {
        if (loc.id === id) locIdx = idx
    })
    if (locIdx < 0) return
    locs.splice(locIdx, 1)
    controller.onGetLocs()
}
