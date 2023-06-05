import React from 'react';
import './WeatherDetail.css';
import kelvinToCelsius from "../../helpers/kelvinToCelsius";
import iconMapper from "../../helpers/iconMapper";

function WeatherDetail({type, description, temperature}) {
  return (
    <section className="day-part">
      <span className="icon-wrapper">
          {iconMapper(type)}
      </span>
      <p className="description">{description}</p>
      <p>{kelvinToCelsius(temperature)}</p>
    </section>
  );
}

export default WeatherDetail;
