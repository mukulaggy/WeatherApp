import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { useState } from "react";
import "./SearchBox.css";

export default function SearchBox({ updateInfo, darkMode }) {
    let [city, setCity] = useState("");
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");

    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "57e39b434e35e651ba45b102a06fcb1b";

    let getWeatherInfo = async () => {
        try {
            let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            if (!response.ok) throw new Error("Please Enter Valid City Name");
            let jsonResponse = await response.json();
            return {
                city: city,
                temp: jsonResponse.main.temp,
                tempMin: jsonResponse.main.temp_min,
                tempMax: jsonResponse.main.temp_max,
                humidity: jsonResponse.main.humidity,
                feelsLike: jsonResponse.main.feels_like,
                weather: jsonResponse.weather[0].description,
            };
        } catch (error) {
            setError(error.message);
            return null;
        }
    };

    let handleChange = (event) => {
        setCity(event.target.value);
        setError("");  // Clear previous errors
    };

    let handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        let newInfo = await getWeatherInfo();
        if (newInfo) updateInfo(newInfo);
        setLoading(false);
        setCity("");
    };

    return (
        <div className={`search-box ${darkMode ? 'dark' : ''}`}>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="city"
                    label="City Name"
                    variant="outlined"
                    value={city}
                    onChange={handleChange}
                    required
                    className="search-input"
                />
                <Button 
                    variant="contained" 
                    type="submit"
                    className="search-button"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Search"}
                </Button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}