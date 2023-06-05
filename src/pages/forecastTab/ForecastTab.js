import React, {useEffect, useState} from 'react';
import './ForecastTab.css';
import axios from "axios";
import kelvinToCelsius from "../../helpers/kelvinToCelsius";
import createDateString from "../../helpers/createDateString";


function ForecastTab({coordinates}) {

    const [forecasts, setForecasts] = useState([]);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
            async function fetchForecasts() {
                toggleLoading(true);
                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.REACT_APP_API_KEY}&lang=nl`);
                    if (response.data){
                        toggleError(false);
                    }
                    const fiveDayForecast = response.data.list.filter((oneForecast) => {
                            return oneForecast.dt_txt.includes("12:00:00");
                        }
                    );
                    setForecasts(fiveDayForecast);
                } catch (e) {
                    console.error(e);
                    toggleError(true);
                }
                toggleLoading(false);
            }


            if (coordinates) {
                void fetchForecasts();
            }
        },
        [coordinates]);


    return (
        <div className="tab-wrapper">
            {error && <span>Er is iets misgegaan met het ophalen van de data</span>}
            {loading && <span>Loading...</span>}
            {forecasts.length === 0 && !error &&
                <span className="no-forecast">
      Zoek eerst een locatie om het weer voor deze week te bekijken
    </span>
            }
            {forecasts.map((day) => {
                return (
                    <article className="forecast-day" key={day.dt}>
                        <p className="day-description">
                            {createDateString(day.dt)}
                        </p>
                        <section className="forecast-weather">
            <span>
             {kelvinToCelsius(day.main.temp)}
            </span>
                            <span className="weather-description">
              {day.weather[0].description}
            </span>
                        </section>
                    </article>
                )
            })}


        </div>
    );
}

export default ForecastTab;
