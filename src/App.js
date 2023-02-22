import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row, Col, Image, Carousel } from 'react-bootstrap';
import axios from "axios";
import { WEATHER_API_KEY, WEATHER_API_URL } from './api';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import L, {Icon} from 'leaflet';


function App() {
  const [loc, setLoc] = useState();
  const [currentWeather, setCurrentWeather] = useState();
  const [forcast, setForcast] = useState();
  const corner1 = L.latLng(-90, -200)
  const corner2 = L.latLng(90, 200)
  const bounds = L.latLngBounds(corner1, corner2)

  useEffect(() => {
    getLocation()
  },[])

  const getLocation = async () => {
    const location = await axios.get("https://ipapi.co/json");
    setLoc(`${location.data.city}, ${location.data.country_code}`);
    const currentWeatherFetch = await axios.get(
      `${WEATHER_API_URL}/weather?lat=${location.data.latitude}&lon=${location.data.longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );
    setCurrentWeather(currentWeatherFetch.data)
    const forecastFetch = await axios.get(
      `${WEATHER_API_URL}/forecast?lat=${location.data.latitude}&lon=${location.data.longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );
    setForcast(forecastFetch.data)
  }

  const searchLocation = async (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    setLoc(searchData.label)
    const currentWeatherFetch = await axios.get(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    setCurrentWeather(currentWeatherFetch.data)
    const forecastFetch = await axios.get(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    setForcast(forecastFetch.data)
  }

  return (
    <div className='App'>
      <Header searchLocation={searchLocation}/>
      <Container className='d-flex flex-column align-items-center mt-5' fluid>
        <Row className='w-100 d-flex flex-md-row flex-column justify-content-between mb-3'>
          <Col className='d-flex flex-column justify-content-center'>
            <h2>{loc && loc}</h2>
            <h3 style={{textTransform: 'capitalize'}} className='d-flex align-items-center justify-content-center'>
              {currentWeather && currentWeather.weather[0].description}
              {currentWeather &&
                <Image
                  alt="weather"
                  src={`icons/${currentWeather.weather[0].icon}.png`}
                  style={{width: '70px'}}
                />
              }
            </h3>
          </Col>
          <Col className='d-flex flex-column align-items-center'>
            <h3>3 Hour Forecast</h3>
            <Carousel indicators={true} wrap={false} variant="dark" className='w-100 pb-3'>
              {forcast && forcast.list.map((item,index) => {
                if(index <= 7){
                  return(
                    <Carousel.Item key={index}>
                      <Card>
                        <Card.Header className='bg-white'>{item.dt_txt}</Card.Header>
                        <Card.Body>
                          <Card.Text style={{textTransform: 'capitalize'}}>Weather: {item.weather[0].description}</Card.Text>
                          <Card.Text>Temperature: {item.main.temp}°C</Card.Text>
                          <Card.Text>Range: {item.main.temp_min}°C - {item.main.temp_max}°C</Card.Text>
                          <Card.Text>Humidity: {item.main.humidity}%</Card.Text>
                          <Card.Text>Wind Speed: {item.wind.speed} KM/H</Card.Text>
                          <Card.Text>Wind Degree: {item.wind.deg}°</Card.Text>
                        </Card.Body>
                      </Card>
                    </Carousel.Item>
                  )
                }
                else{
                  return ''
                }
              })}
            </Carousel>
          </Col>
        </Row>
        <Row xs={1} sm={2} md={3} className='d-flex justify-content-between w-100 mt-2 mx-5'>
          <Col>
            <Card className='text-center shadow mb-5'>
              <Card.Header className='bg-white'>Current Temperature</Card.Header>
              <Card.Body className='my-4 fw-bold fs-5'>{currentWeather && currentWeather.main.temp}°C</Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='text-center shadow mb-5'>
              <Card.Header className='bg-white'>Today's Range</Card.Header>
              <Card.Body className='my-4 fw-bold fs-5'>{currentWeather && `${currentWeather.main.temp_min}°C - ${currentWeather.main.temp_max}°C`}</Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='text-center shadow mb-5'>
              <Card.Header className='bg-white'>Humidity</Card.Header>
              <Card.Body className='my-4 fw-bold fs-5'>{currentWeather && currentWeather.main.humidity}%</Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='text-center shadow mb-5'>
              <Card.Header className='bg-white'>Feels Like</Card.Header>
              <Card.Body className='my-4 fw-bold fs-5'>{currentWeather && currentWeather.main.feels_like}°C</Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='text-center shadow mb-5'>
              <Card.Header className='bg-white'>Wind Speed</Card.Header>
              <Card.Body className='my-4 fw-bold fs-5'>{currentWeather && currentWeather.wind.speed} KM/H</Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='text-center shadow mb-5'>
              <Card.Header className='bg-white'>Wind Degree</Card.Header>
              <Card.Body className='my-4 fw-bold fs-5'>{currentWeather && currentWeather.wind.deg}°</Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <h3 className='mb-4'>Percipitation Map:</h3>
          {currentWeather && 
            <MapContainer maxBoundsViscosity={1.0} maxBounds={bounds} center={[currentWeather.coord.lat, currentWeather.coord.lon]} zoom={3} scrollWheelZoom={false} style={{width: '99vw', height: '75vh'}}>
              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                className='w-100 h-auto'
              />
              <TileLayer
                url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                attribution='&copy; Weather data provided by <a href="https://openweathermap.org/">OpenWeather</a>'
                className='w-100 h-auto'
              />
              <Marker position={[currentWeather.coord.lat, currentWeather.coord.lon]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}/>
            </MapContainer>
          }
        </Row>
      </Container>
    </div>
  )
}

export default App