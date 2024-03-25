export const getWeatherData = (cityName = "mumbai") => {
  return fetch(
    `https://weather-app-backend-1n7x.onrender.com/api/weather-details?city=${cityName}`
  ).then((res) => {
    return res;
  });
};

export const getWeatherDataByCoord = (lat, lon) => {
  return fetch(
    `https://weather-app-backend-1n7x.onrender.com/api/weather-details?lat=${lat}&lon=${lon}`
  ).then((res) => {
    return res.json();
  });
};
