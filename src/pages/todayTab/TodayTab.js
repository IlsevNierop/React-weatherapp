import React, {useEffect, useState} from 'react';
import './TodayTab.css';
import axios from "axios";
import WeatherDetail from "../../components/weatherDetail/WeatherDetail";
import createTimeString from "../../helpers/createTimeString";

function TodayTab({coordinates}) {

    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [singleDayForecast, setSingleDayForecast] = useState({});

    useEffect(() => {
        async function fetchDataSingleDay() {
            toggleLoading(true);
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.REACT_APP_API_KEY}&lang=nl`);
                // console.log(response.data);
                if (response.data) {
                    toggleError(false);
                }
                setSingleDayForecast(response.data.list.slice(0, 3));
            } catch (e) {
                console.log(e);
                toggleError(true);
            }
            toggleLoading(false);
        }

        if (coordinates) {
            void fetchDataSingleDay();
        }

    }, [coordinates]);


    return (
        <div className="tab-wrapper">
            <div className="chart">
                {Object.keys(singleDayForecast).length === 0 && !error &&
                    <span className="no-forecast">
      Zoek eerst een locatie om het weer voor vandaag te bekijken
    </span>
                }
                {Object.keys(singleDayForecast).length > 0 &&
                    <>
                        {singleDayForecast.map((forecast) => {
                            return (
                                <WeatherDetail
                                    key={forecast.dt}
                                    type={forecast.weather[0].main}
                                    description={forecast.weather[0].description}
                                    temperature={forecast.main.temp}>

                                </WeatherDetail>
                            )
                        })}
                    </>
                }

            </div>
            <div className="legend">

                {Object.keys(singleDayForecast).length > 0 &&
                    <>
                        {singleDayForecast.map((forecast) => {
                            return (
                                <span key={`${forecast.dt}-timestamp`}>{createTimeString(forecast.dt)}</span>
                            )
                        })}
                    </>
                }
            </div>
            {
                error && <span>Er is iets misgegaan met het ophalen van de data</span>
            }
            {
                loading && <span>Loading...</span>
            }
        </div>
    )
        ;
}

export default TodayTab;
