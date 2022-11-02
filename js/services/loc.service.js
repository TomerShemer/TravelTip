import { controller } from '../app.controller.js';
import { util } from './utils.service.js'
import { storageService } from './storage.service.js';
import { mapService } from './map.service.js';


export const locService = {
    getLocs,
    setNewLoc,
    deleteLoc,
}

const STORAGE_MAP_KEY = 'mapDB';

const locs = storageService.load(STORAGE_MAP_KEY) || [
    { id: util.makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: util.makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        resolve(locs)
        _saveLocationsToStorage(STORAGE_MAP_KEY)

        // }, 2000)
    })
}

function setNewLoc(lat, lng, name = prompt('Enter name for location')) {
    if (!name) return
    locs.push({
        id: util.makeId(),
        name,
        lat,
        lng,
    })
    mapService.addMarker({ lat, lng })
    controller.onGetLocs()
    controller.onGoToLoc(lat, lng)
    _saveLocationsToStorage()
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

function _saveLocationsToStorage() {
    storageService.save(STORAGE_MAP_KEY, locs);
}
