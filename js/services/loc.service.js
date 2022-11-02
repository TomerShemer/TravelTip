import { controller } from '../app.controller.js';
import { util } from './utils.service.js'
import { storageService } from './storage.service.js';
import { mapService } from './map.service.js';
import { weatherServices } from './weather.serivce.js';

export const locService = {
    getLocs,
    setNewLoc,
    deleteLoc,
    getLocByCoords,
    setCurrLoc,
    getCurrLoc,
}

const STORAGE_MAP_KEY = 'mapDB';

const locs = storageService.load(STORAGE_MAP_KEY) || [
    { id: util.makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384, weather: 24 },
    { id: util.makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581, weather: 24}
]

let gCurrLoc

function getLocs() {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        resolve(locs)
        _saveLocationsToStorage(STORAGE_MAP_KEY)

        // }, 2000)
    })
}

function getLocByCoords(lat, lng) {
    return locs.filter(loc => loc.lat === lat && loc.lng === lng)[0]
}

function setNewLoc(lat, lng, name = prompt('Enter name for location')) {
    if (!name) return
    getWeather(lat, lng)
        .then(degree => Math.round(degree - 273.15))
        .then(degree => {
        locs.push({
            id: util.makeId(),
            name,
            weather: degree,
            lat,
            lng,
            
        })
    }),
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

function setCurrLoc(lat, lng) {
    gCurrLoc = getLocByCoords(lat, lng)
}

function getCurrLoc() {
    return gCurrLoc
}
function getWeather(lat, lng) {
    return weatherServices.askWeather(lat, lng)
        .then((temp) => temp.main.temp);
}
