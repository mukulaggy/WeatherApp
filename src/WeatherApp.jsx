import SearchBox from "./SearchBox.jsx";
import InfoBox from "./InfoBox.jsx";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import "./WeatherApp.css";

export default function WeatherApp() {
    const [weatherInfo, setWeatherInfo] = useState({
        city: "Fetching...",
        feelsLike: 0,
        humidity: 0,
        temp: 0,
        tempMax: 0,
        tempMin: 0,
        weather: "Loading...",
    });

    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "57e39b434e35e651ba45b102a06fcb1b";

    // Function to fetch weather data based on latitude and longitude
    const getWeatherByLocation = async (lat, lon) => {
        try {
            const response = await fetch(
                `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            if (!response.ok) throw new Error("Failed to fetch weather data");

            const jsonResponse = await response.json();
            setWeatherInfo({
                city: jsonResponse.name,
                temp: jsonResponse.main.temp,
                tempMin: jsonResponse.main.temp_min,
                tempMax: jsonResponse.main.temp_max,
                humidity: jsonResponse.main.humidity,
                feelsLike: jsonResponse.main.feels_like,
                weather: jsonResponse.weather[0].description,
            });
        } catch (error) {
            console.error("Error fetching weather by location:", error);
            setWeatherInfo((prev) => ({
                ...prev,
                city: "Unable to detect location",
                weather: "Error fetching data",
            }));
        }
    };

    // Automatically fetch weather on load using Geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getWeatherByLocation(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setWeatherInfo((prev) => ({
                        ...prev,
                        city: "Location permission denied",
                        weather: "Unable to fetch location data",
                    }));
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const updateInfo = (newInfo) => {
        setWeatherInfo(newInfo);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={`weather-container ${darkMode ? 'dark' : ''}`}>
                <div className="header">
                    <h2>Welcome to the WeatherApp</h2>
                    <IconButton 
                        onClick={() => setDarkMode(!darkMode)} 
                        color="inherit"
                        className="theme-toggle"
                    >
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </div>
                <SearchBox updateInfo={updateInfo} darkMode={darkMode} />
                <InfoBox info={weatherInfo} darkMode={darkMode} />
            </div>
        </ThemeProvider>
    );
}