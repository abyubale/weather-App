import { useEffect, useState } from "react";
import {
  getWeatherData,
  getWeatherDataByCoord,
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

  useEffect(() => {
    console.log(navigator);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      getWeatherDataByCoord(latitude, longitude).then((data) => {
        getDataFromApi(data);
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
    getWeatherData(searchedCity)
      .then((data) => {
        getDataFromApi(data);
      })
      .catch(() => {
        console.log("city not Found");
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
          />
        </div>
      </div>
    </>
  );
};
export default WeatherApp;
