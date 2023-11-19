import { useEffect, useState } from "react";
import {
  defaultUrl,
  enterCityName,
  getWeatherData,
  getWeatherDataByCoord,
  notFound,
  realApiCall,
  serverErr,
} from "../../services/getWeatherData";
import WeatherDetails from "../WeatherDetails/WeatherDetails";
import styles from "./WeatherApp.module.css";
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

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          realApiCall(defaultUrl).then((data) => {
            setIsLoader(false);
            getDataFromApi(data);
          });
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setIsError(false);
      getWeatherDataByCoord(latitude, longitude).then((data) => {
        // console.log(data);
        if (data === enterCityName) {
          setIsLoader(false);
          setIsError(true);
          setErrorMsg(enterCityName);
        } else if (data === serverErr) {
          setIsLoader(false);
          setIsError(true);
          setErrorMsg(serverErr);
        } else if (data !== enterCityName && data !== serverErr) {
          realApiCall(data).then((data) => {
            setIsLoader(false);
            getDataFromApi(data);
          });
        }
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

  const convertUnixTimestampToTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    // Convert hours to 12-hour format and determine AM/PM
    const formattedHours = hours % 12 || 12;
    const amPm = hours < 12 ? "AM" : "PM";

    const formattedTime = `${formattedHours} : ${minutes.substr(-2)} ${amPm}`;
    return formattedTime;
  };

  const getCurrentDate = () => {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = today.getFullYear();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = daysOfWeek[today.getDay()];

    const formattedDate = `${day}/${month}/${year} ${dayOfWeek}`;
    return formattedDate;
  };

  const inputSerachHandler = (e) => {
    const userInput = e.target.value;
    setSearchedCity(userInput.trim().toLowerCase());
  };

  const searchBtnClickHandler = () => {
    setIsLoader(true);
    setIsError(false);
    getWeatherData(searchedCity).then((url) => {
      console.log(url);
      if (url === serverErr) {
        setIsLoader(false);
        setIsError(true);
        setErrorMsg(serverErr);
      }
      if (url === notFound) {
        setIsLoader(false);
        setIsError(true);
        setErrorMsg("Please enter the valid city name !!!");
      }
      if (url !== notFound) {
        realApiCall(url).then((data) => {
          console.log("Success");
          console.log(data);
          setIsLoader(false);
          getDataFromApi(data);
        });
      }
    });
  };

  const enterBtnClickHandler = (e) => {
    if (e.key === "Enter") searchBtnClickHandler();
  };

  return (
    <>
      <div className={styles.weather}>
        <div>
          <WeatherDetails
            searchBtnClickHandler={searchBtnClickHandler}
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
