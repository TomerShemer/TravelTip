export const weatherServices = {
    askWeather
}
const WEATHER_KEY = 'ac5287161f76f34fbd30920fd1979c9f'

function askWeather(lat, lng) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WEATHER_KEY}`)
        .then(users => {
            return users.data
        })
        .catch(err => {
            console.log('Error while fetching tempreture', err);
            throw err
        })
}