const yargs = require('yargs');
const axios = require('axios');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

  const encodedAddress = encodeURIComponent(argv.address);
  const geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

  axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address.')
    }

    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;

    const weatherUrl = `https://api.darksky.net/forecast/18353b855bb906abae0a591ea6fdc0c9/${lat},${lng}`
    console.log(response.data.results[0].formatted_address);

    return axios.get(weatherUrl);
  }).then((response) => {
    const temperature = response.data.currently.temperature
    const apparentTemperature = response.data.currently.apparentTemperature
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
  }).catch((err) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(err.message);
    }
  })
