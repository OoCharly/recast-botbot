
const rp = require('request-promise')

const weather = (lat, lon, place) => {
	var options = {
		uri: `http://api.openweathermap.org/data/2.5/weather`,
		headers: { 'User-Agent': 'Request-Promise' },
		qs: { lat: `${lat}`, lon:`${lon}` , appid: "e50186934d86c3da5401a7d1c13282c6", units: "metric" }
	}
	return rp(options).then(result => {
		const body = JSON.parse(result);
		console.log(body);
		return Promise.resolve(
			{ type: "card", content:{
				title: `${place}`,
				subtitle: `Temperature: ` + body.main.temp + '°C\nHumidity: ' + body.main.humidity + '%',
				imageUrl: 'http://openweathermap.org/img/w/' + body.weather[0].icon + '.png',
				buttons: [
					{
						title: 'Forecast',
						type: 'web_url',
						value: 'http://openweathermap.org/find?q=' + encodeURIComponent(place)
					}
				]
			}}
			//{ type:"text", content: `${place}\nTemperature: ` + body.main.temp + '°C\nHumidity: ' + body.main.humidity + '%'}
		)
	})
	.catch((err) => {
		console.log("Error while sending request to OpenWeatherMap", err)
	})
}

module.exports = weather
