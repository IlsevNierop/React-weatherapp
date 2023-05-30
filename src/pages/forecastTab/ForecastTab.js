import React, {useEffect, useState} from 'react';
import './ForecastTab.css';
import axios from "axios";

const apiKey = '3a011396b9d37ba95c3afedc93ab5094';


function ForecastTab({coordinates}) {

    function getWeekDay(timeStamp) {
        const day = new Date(timeStamp * 1000);
        return day.toLocaleDateString('nl-NL', {weekday: 'long'});
    }

    const [forecasts, setForecasts] = useState([]);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
            async function fetchForecasts() {
                toggleLoading(true);
                try {
                    toggleError(false);
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&lang=nl`);
                    console.log(response.data);
                    const fiveDayForecast = response.data.list.filter((oneForecast) => {
                            return oneForecast.dt_txt.includes("12:00:00");
                        }
                    );
                    console.log(fiveDayForecast);
                    setForecasts(fiveDayForecast);
                } catch (e) {
                    console.error(e);
                    toggleError(true);
                }
                toggleLoading(false);
            }


            if (coordinates) {
                fetchForecasts();
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
                            {getWeekDay(day.dt)}
                        </p>

                        <section className="forecast-weather">
            <span>
             {day.main.temp}&deg; C
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
