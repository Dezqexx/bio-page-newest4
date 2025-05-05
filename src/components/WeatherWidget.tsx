
import React, { useState, useEffect } from 'react';
import { Cloud, CloudSun, Loader } from 'lucide-react';

type WeatherData = {
  temp: number;
  condition: string;
  location: string;
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location using geolocation API
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Use OpenWeatherMap API to get weather data
            // Note: In a production app, this API key should be stored securely
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=1e1399025a8442dff67aa8ae5c54b731`
            );
            
            if (!response.ok) {
              throw new Error('Weather data not available');
            }
            
            const data = await response.json();
            
            setWeather({
              temp: Math.round(data.main.temp),
              condition: data.weather[0].main,
              location: data.name
            });
            setLoading(false);
          },
          (err) => {
            console.error('Geolocation error:', err);
            setError('Location access denied');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to load weather');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="p-2 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded border border-[#00ff00]/30">
        <Loader className="h-4 w-4 text-[#00ff00] animate-spin" />
        <span className="text-xs text-[#00ff00]/80">Loading weather...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded border border-[#00ff00]/30">
        <span className="text-xs text-[#00ff00]/80">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-2 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded border border-[#00ff00]/30">
      {weather?.condition.toLowerCase().includes('cloud') ? (
        <CloudSun className="h-4 w-4 text-[#00ff00]" />
      ) : (
        <Cloud className="h-4 w-4 text-[#00ff00]" />
      )}
      <div className="text-xs text-[#00ff00]/80">
        <span className="font-bold">{weather?.temp}°C</span> - {weather?.location}
      </div>
    </div>
  );
};

export default WeatherWidget;
