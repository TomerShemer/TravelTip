import { locService } from './loc.service.js';

export const mapService = {
    initMap,
    addMarker,
    panTo,

}
// Var that is used throughout this Module (not global)
var gMarker
var gMap

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
                // Create a new InfoWindow.
                let infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,

                });
                const latlng = mapsMouseEvent.latLng.toJSON()
                locService.setNewLoc(latlng.lat, latlng.lng)
                addMarker(latlng)

            });
        })
}

/*function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            gMap.addListener('click', function (e) {
                console.log(e);
                addMarker(e.latLng);
            })
        })
}*/

function addMarker(loc) {
    if (gMarker) gMarker.setMap(null);
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })

    const infowindow = new google.maps.InfoWindow({
        content: `
                <h2>Hello</h2>
                <form onsubmit="setNewLoc(event)">
                    <input class="input-loc-name" type="text" placeholder="Enter location name">
                    <button>Submit</button>
                </form>
                `,
    });

    marker.addListener("click", () => {
        infowindow.open({
            anchor: marker,
            map: gMap,
        });
    });
    // gMarker = marker
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