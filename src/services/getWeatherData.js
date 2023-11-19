export const notFound = "city not found";
export const serverErr = "Something went wrong please try again later !!!";
export const enterCityName = "City Not Found !!! Please Enter City Name.";
export const defaultUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=mumbai&limit=5&appid=88f2c30681ef3d7fd287876f375145f0";

export const getWeatherData = (cityName) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&limit=5&appid=88f2c30681ef3d7fd287876f375145f0`
  )
    .then((res) => {
      if (res.status === 404) return notFound;
      else if (res.status >= 200 && res.status <= 299) return res.url;
    })
    .catch(() => serverErr);
};

export const realApiCall = (url) => {
  return fetch(url).then((res) => res.json());
};

export const getWeatherDataByCoord = (lat, lon) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&l&appid=88f2c30681ef3d7fd287876f375145f0`
  )
    .then((res) => {
      if (res.status >= 500 && res.status <= 599) return serverErr;
      else if (res.status >= 200 && res.status <= 299) return res.url;
    })
    .catch(() => enterCityName);
};
