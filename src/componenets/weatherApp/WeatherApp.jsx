import { useEffect, useState } from "react";
import {
  getWeatherData,
  getWeatherDataByCoord,
} from "../../services/getWeatherData";
import WeatherDetails from "../WeatherDetails/WeatherDetails";
import styles from "./WeatherApp.module.css";
import {
  convertUnixTimestampToTime,
  getCurrentDate,
} from "../utility/timeDate";

const serverErr = "Something went wrong please try again later !!!";
const notFoundErr = "City not found, Please enter valid city name !!!";
const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState({
    cityTemp: "",
    cityName: "",
    humidity: "",
    windSpeed: "",
    sky: "",
    sunrise: "",
    sunset: "",
    date: "",
  });

  const [isLoader, setIsLoader] = useState(false);
  const [searchedCity, setSearchedCity] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getWeatherUpdate = (city) => {
    getWeatherData(city)
      .then((data) => {
        const notFoundErrorCode = parseInt(data.cod);
        if (notFoundErrorCode >= 400 && notFoundErrorCode < 499) {
          setIsLoader(false);
          setIsError(true);
          setErrorMsg(notFoundErr);
          return;
        } else {
          setIsLoader(false);
          getDataFromApi(data);
        }
      })
      .catch(() => {
        setIsLoader(false);
        setIsError(true);
        setErrorMsg(serverErr);
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          getWeatherUpdate();
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setIsError(false);
      getWeatherDataByCoord(latitude, longitude)
        .then((data) => {
          const notFoundErrorCode = parseInt(data.cod);
          if (notFoundErrorCode >= 400 && notFoundErrorCode < 499) {
            setIsLoader(false);
            setIsError(true);
            setErrorMsg(notFoundErr);
            return;
          } else {
            setIsLoader(false);
            getDataFromApi(data);
          }
        })
        .catch(() => {
          setIsLoader(false);
          setIsError(true);
          setErrorMsg(serverErr);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  const getDataFromApi = (data) => {
    const copyOfWeatherData = { ...weatherData };
    copyOfWeatherData.cityTemp = (data.main.temp - 273.15).toFixed(2);
    copyOfWeatherData.cityName = data.name;
    copyOfWeatherData.humidity = data.main.humidity;
    copyOfWeatherData.windSpeed = data.wind.speed;
    copyOfWeatherData.sky = data.weather[0].main;
    copyOfWeatherData.sunrise = convertUnixTimestampToTime(data.sys.sunrise);
    copyOfWeatherData.sunset = convertUnixTimestampToTime(data.sys.sunset);
    copyOfWeatherData.date = getCurrentDate();
    setWeatherData(copyOfWeatherData);
    setIsLoader(false);
    setSearchedCity("");
  };

  const inputSerachHandler = (e) => {
    const userInput = e.target.value;
    setSearchedCity(userInput.trim().toLowerCase());
  };

  const enterBtnClickHandler = (e) => {
    if (e.key === "Enter") {
      setIsLoader(true);
      setIsError(false);
      getWeatherUpdate(searchedCity);
    }
  };

  return (
    <>
      <div className={styles.weather}>
        <div>
          <WeatherDetails
            weatherData={weatherData}
            isLoader={isLoader}
            inputSerachHandler={inputSerachHandler}
            searchedCity={searchedCity}
            enterBtnClickHandler={enterBtnClickHandler}
            isError={isError}
            errorMsg={errorMsg}
          />
        </div>
      </div>
    </>
  );
};
export default WeatherApp;
