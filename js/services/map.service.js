import { locService } from './loc.service.js';
import { storageService } from './storage.service.js';

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMarkers,
    removeMarkers,
    getLocationByName,
}
// Var that is used throughout this Module (not global)

const API_KEY = 'AIzaSyDGWeJL2TG9pFic9i1BQLN5-5_jx1YbQNc'

var gMarker
var gMap
let gMarkers = []


function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');

    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
        })
        .then(() => {
            gMap.addListener("click", (mapsMouseEvent) => {
                // // Create a new InfoWindow.
                // let infoWindow = new google.maps.InfoWindow({
                //     position: mapsMouseEvent.latLng,

                // });
                const latlng = mapsMouseEvent.latLng.toJSON()
                locService.setNewLoc(latlng.lat, latlng.lng)

            });
        })
}

function addMarker(loc) {
    if (gMarker) gMarker.setMap(null);
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    gMarkers.push(marker)
    // console.log('gMarkers', gMarkers)
}

function getMarkers() {
    return gMarkers
}

function removeMarkers() {
    gMarkers.forEach(marker => marker.setMap(null))
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyA1LK7-L0R0NoXRPeMTs5E0YVFSGKa0kss'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function getLocationByName(txt) {
    return axios
        .get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${txt}&key=${API_KEY}`
        )
        .then((loc) => {
            const location = loc.data.results[0].geometry.location
            console.log(loc.data.results[0].geometry.location)
            panTo(location.lat, location.lng);
            addMarker({ lat: location.lat, lng: location.lng })
        })
        .catch((err) => {
            console.log('Not enabled to get any location / API Key wrong.', err);
            throw err;
        });

}