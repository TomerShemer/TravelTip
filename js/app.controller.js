import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
export const controller = {
    onGetLocs,
    onGoToLoc
}
window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoToLoc = onGoToLoc

let gMarkers = []


function onInit() {
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready');
            onGetLocs()
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat = 32.0749831, lng = 34.9120554) {
    console.log('Adding a marker');
    mapService.addMarker({ lat, lng });
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        const strHtmls = locs.map((loc) => {
            onAddMarker(loc.lat, loc.lng)
            return `<tr>
                        <td class="name">${loc.name}</td>
                        <td class="name">${loc.weather}°</td>
                        <td><button onclick="onGoToLoc(${loc.lat},${loc.lng})">Go Location</button></td>
                        <td><button onclick="onDeleteLoc(${loc.id})">Delete Location</button></td>
                    </tr>`
        });
        document.querySelector('.locs-container').innerHTML = strHtmls.join('');

    });
}
function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}
function onGoToLoc(lat, lng) {
    mapService.panTo(lat, lng)
}
function onDeleteLoc(lat, lng) {
    locService.deleteLoc(lat, lng);
    onGetLocs();
}