/* eslint-disable react/prop-types */
import TextField from "@mui/material/TextField";
import styles from "./WeatherDetails.module.css";

import LoadingButton from "@mui/lab/LoadingButton";

const WeatherDetails = ({
  isLoader,
  weatherData,
  searchBtnClickHandler,
  inputSerachHandler,
  searchedCity,
  enterBtnClickHandler,
}) => {
  return (
    <>
      <div>
        <div className={styles.searchbox}>
          <div className="main">
            <div
              className="search"
              style={{
                borderLeft: "4px solid",
                borderRight: "4px solid",
                borderBottom: "4px solid",
                borderRadius: "10px",
              }}
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                label="Enter city name here"
                onChange={inputSerachHandler}
                value={searchedCity}
                type="text"
                onKeyUp={enterBtnClickHandler}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          {" "}
          <LoadingButton
            color="secondary"
            loading={isLoader}
            variant="contained"
            onClick={searchBtnClickHandler}
            style={{
              backgroundColor: !isLoader ? "green" : "#829eb3",
              width: "130px",
              padding: "10px",
            }}
          >
            <span>Search</span>
          </LoadingButton>
        </div>
        <div
          style={{
            width: "600px",
            backgroundColor: "#262A2E",
            height: "400px",
            borderRadius: "30px",
            opacity: "85%",
            margin: "20px",
            color: "white",
            fontSize: "20px",
            padding: "80px",
          }}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div>
            <h2>{weatherData.cityName}</h2>
          </div>
          <div>
            <h3>{weatherData.cityTemp ? `${weatherData.cityTemp}°C` : ""}</h3>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <div>
              <p>
                {weatherData.humidity
                  ? `Humidity : ${weatherData.humidity} %`
                  : ""}
              </p>
            </div>

            <div>
              <p>
                {weatherData.windSpeed
                  ? `Wind-Speed : ${weatherData.windSpeed} Km/h`
                  : ""}
              </p>
            </div>
          </div>

          <div
            className="d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <div>
              <p>
                {weatherData.sunrise
                  ? `Sunrise  \u00A0${weatherData.sunrise}`
                  : ""}
              </p>
            </div>

            <div>
              <p>
                {weatherData.sunset
                  ? `Sunset  \u00A0${weatherData.sunset}`
                  : ""}
              </p>
            </div>
          </div>

          <div>
            <p> {weatherData.sky ? `Sky : ${weatherData.sky}` : ""}</p>
          </div>
          <div>
            <p>{weatherData.date ? `Date :  ${weatherData.date}` : ""}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default WeatherDetails;
