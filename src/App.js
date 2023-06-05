import React, {useEffect, useState} from 'react';
import './App.css';
import SearchBar from './components/searchBar/SearchBar';
import TabBarMenu from './components/tabBarMenu/TabBarMenu';
import MetricSlider from './components/metricSlider/MetricSlider';
import axios from 'axios';
import ForecastTab from "./pages/forecastTab/ForecastTab";
import TodayTab from "./pages/todayTab/TodayTab";
import {Routes, Route} from 'react-router-dom';
import kelvinToCelsius from './helpers/kelvinToCelsius';

function App() {

    const [weatherData, setWeatherData] = useState({});
    const [location, setLocation] = useState('');
    const [error, toggleError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            // bij unmount gebruik je deze dat alle requests worden gecanceld
            try {
                const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location},nl&appid=${process.env.REACT_APP_API_KEY}&lang=nl`, {
                    // dit zorgt ervoor dat de signal van axios package gekoppeld wordt aan de controller signal
                    signal: controller.signal
                });

                if (result.data) {
                    toggleError(false);
                }
                // console.log(result.data);
                setWeatherData(result.data);

            } catch (e) {
                if (axios.isCancel(e)) {
                    console.log("The axios request was cancelled")
                } else {
                    console.error(e);
                    toggleError(true);
                }


            }
        }

        if (location) {
            void fetchData();
        }

        return function cleanUp() {
            controller.abort();
        }

    }, [location]);


    return (
        <>
            <div className="weather-container">

                {/*HEADER -------------------- */}
                <div className="weather-header">
                    <SearchBar setLocationHandler={setLocation}/>
                    {error && <span className="wrong-location-error">Oeps! Deze locatie bestaat niet</span>}

                    <span className="location-details">
            {Object.keys(weatherData).length > 0 &&
                <>
                    <h2>{weatherData.weather[0].description}</h2>
                    <h3>{weatherData.name}</h3>
                    <h1>{kelvinToCelsius(weatherData.main.temp)}</h1>
                </>}

          </span>
                </div>

                {/*CONTENT ------------------ */}
                <div className="weather-content">
                    <TabBarMenu/>

                    <div className="tab-wrapper">
                        <Routes>
                            <Route path="/" element={<TodayTab coordinates={weatherData.coord}/>}/>
                            <Route path="/komende-week"
                                   element={<ForecastTab coordinates={weatherData.coord}/>}/>
                        </Routes>
                    </div>
                </div>

                <MetricSlider/>
            </div>
        </>
    );
}

export default App;
