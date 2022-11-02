import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

export const controller = {
    onGetLocs,
    onGoToLoc,
    renderLocationTxt,
}
window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoToLoc = onGoToLoc
window.onDeleteLoc = onDeleteLoc
window.onSearchLocation = onSearchLocation
window.onCopyUrl = onCopyUrl


function onInit() {
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready');
            onGetLocs()
            renderLocationByQueryStringParams()
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
        mapService.removeMarkers()
        const strHtmls = locs.map((loc) => {
            onAddMarker(loc.lat, loc.lng)
            return `<tr>
                        <td class="name">${loc.name} | </td>
                        <td class="name"><p>Temp: ${loc.weather}°</td>
                        <td><button onclick="onGoToLoc(${loc.lat},${loc.lng})">Go Location</button></td>
                        <td><button onclick="onDeleteLoc('${loc.id}')">Delete Location</button></td>
                    </tr>`
        });
        document.querySelector('.locs-container').innerHTML = strHtmls.join('');
    });
}
function onGetUserPos() {
    console.log('test??');
    getPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords);
            mapService.addMarker(pos.coords);
            mapService.panTo(pos.coords.latitude, pos.coords.longitude);
            locService.setNewLoc(pos.coords.latitude, pos.coords.longitude, 'User Location')
            locService.getLocs()
        })
        .catch((err) => {
            console.log('err!!!', err);
        });
}

function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}
function onGoToLoc(lat, lng) {
    mapService.panTo(lat, lng)
    renderLocationTxt(lat, lng)
}
function onDeleteLoc(id) {
    locService.deleteLoc(id);
    onGetLocs();

}

function getUrl(lat, lng) {
    var queryStringParams = `?lat=${lat || ''}&lng=${lng}`
    if (!lat && !lng) queryStringParams = ''
    return window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    // window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderLocationByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    // console.log('queryStringParams', queryStringParams)
    const lat = +queryStringParams.get('lat') || ''
    const lng = +queryStringParams.get('lng') || ''
    if (!lat || !lng) return
    onGoToLoc(lat, lng)
    const isExisting = locService.getLocs().some(loc => {
        return loc.lat === lat && loc.lng === lng
    })
    if (isExisting) return

    locService.setNewLoc(lat, lng, 'New Location')
    onGetLocs()
}
function onSearchLocation(ev) {
    ev.preventDefault();
    console.log(ev.target[0].value);
    mapService.getLocationByName(ev.target[0].value);
}

function onCopyUrl() {
    const currLoc = locService.getCurrLoc()
    const { lat, lng } = currLoc
    const url = getUrl(lat, lng)
    navigator.clipboard.writeText(url)
    swal.fire('Url copied')
}

function renderLocationTxt(lat, lng) {
    const loc = locService.getLocByCoords(lat, lng)
    //document.querySelector('.map-nav h3 span').innerText = loc.name
}