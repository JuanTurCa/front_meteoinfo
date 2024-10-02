import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet"; // Importamos leaflet para crear íconos personalizados

const API_KEY = '00477105ca4041c7bb2202511242409'; // Reemplaza con tu clave de WeatherAPI

export const PagePrincipalPriv = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [debouncedCoords, setDebouncedCoords] = useState(null);
  const [currentPosition, setCurrentPosition] = useState([4.60971, -74.08175]); // Ubicación por defecto en Colombia
  const [mapZoom, setMapZoom] = useState(5); // Estado para el nivel de zoom
  const [pinPosition, setPinPosition] = useState([4.60971, -74.08175]); // Estado para la posición del pin
  const [mapInstance, setMapInstance] = useState(null); // Instancia del mapa

  // Debouncing para evitar hacer demasiadas llamadas a la API
  useEffect(() => {
    if (!hoverPosition) return;

    const handler = setTimeout(() => {
      setDebouncedCoords(hoverPosition);
    }, 500); // Espera 500 ms antes de actualizar las coordenadas

    return () => {
      clearTimeout(handler);
    };
  }, [hoverPosition]);

  // Obtener datos del clima cuando se actualicen las coordenadas con debounce
  useEffect(() => {
    if (!debouncedCoords) return;

    const fetchWeatherData = async (lat, lon) => {
      try {
        const response = await axios.get(
          `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData(debouncedCoords.lat, debouncedCoords.lon);
  }, [debouncedCoords]);

  // Hook personalizado para centrar el mapa solo cuando se presione el botón
  function UpdateMapCenter({ position, zoomLevel }) {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, zoomLevel);
      }
    }, [position, zoomLevel, map]);
    return null;
  }

  // Maneja los eventos del mapa, incluyendo el clic para mover el pin
  const MapEvents = () => {
    useMapEvents({
      mousemove(e) {
        const { lat, lng } = e.latlng;
        setHoverPosition({ lat, lon: lng });
      },
      click(e) {
        const { lat, lng } = e.latlng;
        setPinPosition([lat, lng]); // Actualiza la posición del pin al hacer clic en el mapa
      },
    });
    return null;
  };

  // Crear un ícono personalizado para el marcador
  const customIcon = new L.Icon({
    iconUrl: weatherData?.current?.condition?.icon || "defaultIcon.png", // Usa un icono por defecto si no hay clima
    iconSize: [50, 50], // Tamaño del icono
    iconAnchor: [25, 25], // Punto de anclaje (centrado)
  });

  // Función para manejar el botón de ubicación actual
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          setPinPosition([latitude, longitude]); // Coloca el pin en la ubicación actual
          setMapZoom(12); // Actualizamos el zoom automáticamente cuando obtenemos la ubicación actual
        },
        (error) => {
          console.error("Error obteniendo la geolocalización:", error);
        }
      );
    } else {
      console.log("La geolocalización no está soportada por este navegador.");
    }
  };

  return (
    <div className="layout">
      <div className="map-container">
        <button onClick={handleLocationClick}>Usar mi ubicación actual</button>
        <MapContainer 
          center={currentPosition} 
          zoom={mapZoom} 
          style={{ height: "100vh", width: "100%"}} 
          whenCreated={setMapInstance}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <UpdateMapCenter position={currentPosition} zoomLevel={mapZoom} />
          <MapEvents />

          {/* Marcador para la posición del pin */}
          {pinPosition && (
            <Marker position={pinPosition} icon={customIcon}>
              <Popup>
                <div style={{ fontSize: "18px", lineHeight: "1.5" }}>
                  <h3>Ubicación seleccionada</h3>
                  <p>Latitud: {pinPosition[0]}</p>
                  <p>Longitud: {pinPosition[1]}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Marcador para hover con información del clima */}
          {hoverPosition && weatherData && (
            <Marker position={[hoverPosition.lat, hoverPosition.lon]} icon={customIcon}>
              <Popup autoPan={false}>
                <div style={{ fontSize: "18px", lineHeight: "1.5" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: "bold" }}>{weatherData.location.name}</h3>
                  <p><strong>Temperatura:</strong> {weatherData.current.temp_c}°C</p>
                  <p><strong>Condiciones:</strong> {weatherData.current.condition.text}</p>
                  <img
                    src={weatherData.current.condition.icon}
                    alt="weather icon"
                    style={{ width: "60px", height: "60px" }} // Ajusta el tamaño del icono aquí
                  />
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Recuadro a la derecha */}
      <div className="sidebar">
        <h2>Panel de Información</h2>
        <p>Aquí puedes añadir más componentes o información relevante.</p>
      </div>
    </div>
  );
};

export default PagePrincipalPriv;
