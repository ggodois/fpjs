const axios = require('axios');

const APPID = '96d26636d42f5db7396fcbf77aebe834';

const getWeather = async (city) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&units=imperial&APPID=${APPID}`;
    const response = await axios({ url });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log('axios::error', JSON.stringify(err.response.data, null, 2));
  }
};

export default getWeather;
