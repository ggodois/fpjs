import config from './config';

const MSGS = {
  ADD_LOCATION: 'ADD_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
  LOCATION_INPUT: 'LOCATION_INPUT',
  GET_WEATHER: 'GET_WEATHER',
  GET_WEATHER_ERROR: 'GET_WEATHER_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

export const addLocationMessage = { type: MSGS.ADD_LOCATION };

export const deleteLocationMessage = id => ({
  type: MSGS.DELETE_LOCATION, id,
});

export const locationInputMessage = location => ({
  type: MSGS.LOCATION_INPUT, location,
});

const getWeatherMessage = (id, res) => ({
  type: MSGS.GET_WEATHER,
  id,
  res,
});

const getWeatherErrorMessage = (error) => ({
  type: MSGS.GET_WEATHER_ERROR,
  error,
});

export const clearErrorMessage = { type: MSGS.CLEAR_ERROR };

const add = (model) => {
  const { nextId, location, locations } = model;
  const newLocation = {
    id: nextId, name: location, temp: '?', high: '?', low: '?',
  };
  const updatedLocations = [...locations, newLocation];
  return [
    {
      nextId: nextId + 1, location: '', locations: updatedLocations,
    },
    {
      request: {
        url: `${config.weatherService.host}`,
        params: {
          q: encodeURI(location),
          units: 'metric',
          APPID: config.weatherService.apiid,
        },
      },
      weatherMessage: getWeatherMessage,
      weatherErrorMessage: getWeatherErrorMessage,
    },
  ];
};

function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD_LOCATION: {
      return add(model);
    }
    case MSGS.DELETE_LOCATION: {
      const { id } = msg;
      const locations = model.locations.filter(e => e.id !== id);
      return { ...model, locations };
    }
    case MSGS.LOCATION_INPUT: {
      const { location } = msg;
      return { ...model, location };
    }
    case MSGS.GET_WEATHER: {
      const { id, res } = msg;
      const { locations } = model;
      const weatherData = res.main || {};
      const { temp, temp_min, temp_max } = weatherData;
      const updatedLocations = locations.map(location => {
        if (location.id === id) {
          return {
            ...location,
            temp: Math.round(temp),
            low: Math.round(temp_min),
            high: Math.round(temp_max),
          };
        }
        return location;
      });
      return { ...model, locations: updatedLocations };
    }
    case MSGS.GET_WEATHER_ERROR: {
      const { error } = msg;
      return { ...model, error: error.message };
    }
    case MSGS.CLEAR_ERROR: {
      return { ...model, error: null };
    }
    default: return model;
  }
}

export default update;
