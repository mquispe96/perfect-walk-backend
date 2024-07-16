const moment = require('moment');
const weather = require('../controllers/weather.controller');

const formatAllWeatherData = data => {
  const current = {
    temperature: `${data.current.temp}°F`,
    feelsLike: `${data.current.feels_like}°F`,
    weather: data.current.weather,
    sunrise: moment.unix(data.current.sunrise).format('hh:mm A'),
    sunset: moment.unix(data.current.sunset).format('hh:mm A'),
    dateTime: moment.unix(data.current.dt).format('MMMM Do YYYY, hh:mm A'),
    windSpeed: `${data.current.wind_speed} mph`,
    windDeg: `${data.current.wind_deg}°`,
    humidity: `${data.current.humidity}%`,
    dewPoint: `${data.current.dew_point}°F`,
    visibility: `${data.current.visibility} meters`,
    pressure: `${data.current.pressure} hPa`,
    uvi: data.current.uvi,
    clouds: `${data.current.clouds}%`,
    rain: data.current.rain ? `${data.current.rain['1h']} mm/h` : '0 mm/h',
    snow: data.current.snow ? `${data.current.snow['1h']} mm/h` : '0 mm/h',
  };
  const minutely = data.minutely.map(entry => ({
    dateTime: moment.unix(entry.dt).format('hh:mm A'),
    precipitation: `${entry.precipitation} mm/h`,
  }));
  const hourly = data.hourly.map(entry => ({
    dateTime: moment.unix(entry.dt).format('hh:mm A'),
    temperature: `${entry.temp}°F`,
    weather: entry.weather,
    feelsLike: `${entry.feels_like}°F`,
    windSpeed: `${entry.wind_speed} mph`,
    windDeg: `${entry.wind_deg}°`,
    humidity: `${entry.humidity}%`,
    dewPoint: `${entry.dew_point}°F`,
    visibility: `${entry.visibility} meters`,
    pressure: `${entry.pressure} hPa`,
    uvi: entry.uvi,
    clouds: `${entry.clouds}%`,
    rain: entry.rain ? `${entry.rain['1h']} mm/h` : '0 mm/h',
    snow: entry.snow ? `${entry.snow['1h']} mm/h` : '0 mm/h',
    pop: `${entry.pop}%`,
  }));
  const daily = data.daily.map(entry => ({
    date: moment.unix(entry.dt).format('MMMM Do YYYY'),
    sunrise: moment.unix(entry.sunrise).format('hh:mm A'),
    sunset: moment.unix(entry.sunset).format('hh:mm A'),
    moonrise: moment.unix(entry.moonrise).format('hh:mm A'),
    moonset: moment.unix(entry.moonset).format('hh:mm A'),
    moonPhase: entry.moon_phase,
    weather: entry.weather,
    summary: entry.summary,
    morningTemp: `${entry.temp.morn}°F`,
    dayTemp: `${entry.temp.day}°F`,
    eveningTemp: `${entry.temp.eve}°F`,
    nightTemp: `${entry.temp.night}°F`,
    minTemp: `${entry.temp.min}°F`,
    maxTemp: `${entry.temp.max}°F`,
    feelsLikeMorning: `${entry.feels_like.morn}°F`,
    feelsLikeDay: `${entry.feels_like.day}°F`,
    feelsLikeEvening: `${entry.feels_like.eve}°F`,
    feelsLikeNight: `${entry.feels_like.night}°F`,
    pressure: `${entry.pressure} hPa`,
    humidity: `${entry.humidity}%`,
    dewPoint: `${entry.dew_point}°F`,
    windSpeed: `${entry.wind_speed} mph`,
    windDeg: `${entry.wind_deg}°`,
    clouds: `${entry.clouds}%`,
    pop: `${entry.pop}%`,
    rain: entry.rain ? `${entry.rain} mm` : '0 mm',
    snow: entry.snow ? `${entry.snow} mm` : '0 mm',
    uvi: entry.uvi,
  }));
  const alerts = data.alerts
    ? data.alerts.map(entry => ({
        event: entry.event,
        start: moment.unix(entry.start).format('MMMM Do YYYY, hh:mm A'),
        end: moment.unix(entry.end).format('MMMM Do YYYY, hh:mm A'),
        description: entry.description,
      }))
    : [];
  return {
    current,
    minutely,
    hourly,
    daily,
    alerts,
  };
};

const formatCurrentWeatherData = data => {
  const current = {
    temperature: `${data.current.temp}°F`,
    feelsLike: `${data.current.feels_like}°F`,
    weather: data.current.weather,
    sunrise: moment.unix(data.current.sunrise).format('hh:mm A'),
    sunset: moment.unix(data.current.sunset).format('hh:mm A'),
    dateTime: moment.unix(data.current.dt).format('MMMM Do YYYY, hh:mm A'),
    windSpeed: `${data.current.wind_speed} mph`,
    windDeg: `${data.current.wind_deg}°`,
    humidity: `${data.current.humidity}%`,
    dewPoint: `${data.current.dew_point}°F`,
    visibility: `${data.current.visibility} meters`,
    pressure: `${data.current.pressure} hPa`,
    uvi: data.current.uvi,
    clouds: `${data.current.clouds}%`,
    rain: data.current.rain ? `${data.current.rain['1h']} mm/h` : '0 mm/h',
    snow: data.current.snow ? `${data.current.snow['1h']} mm/h` : '0 mm/h',
  };
    return {
    current,
  };
}

module.exports = {formatAllWeatherData, formatCurrentWeatherData};
