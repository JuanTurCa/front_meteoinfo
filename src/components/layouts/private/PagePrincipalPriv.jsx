import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import { useForm } from '../../../hooks/useForm';
import useAuth from "../../../hooks/useAuth";
import { Global } from "../../../helpers/Global";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API_KEY = '00477105ca4041c7bb2202511242409';

export const PagePrincipalPriv = () => {
  //Para el mapa
  const [weatherData, setWeatherData] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [debouncedCoords, setDebouncedCoords] = useState(null);
  const [currentPosition, setCurrentPosition] = useState([4.60971, -74.08175]); // Ubicación por defecto en Colombia
  const [mapZoom, setMapZoom] = useState(5); // Estado para el nivel de zoom
  const [pinPosition, setPinPosition] = useState([4.60971, -74.08175]); // Estado para la posición del pin
  const [mapInstance, setMapInstance] = useState(null); // Instancia del mapa

  // Para obtener alertas
  const [alertas, setAlertas] = useState([]); // Estado para guardar las alertas
  const [currentAlertaIndex, setCurrentAlertaIndex] = useState(0); // Estado para la alerta que se está mostrando

  //Para enviar una alerta
  const { auth } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const navigate = useNavigate();

  // Obtener todas las alertas al cargar la página
  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const response = await fetch(Global.url + "/meteoinfo/alertas/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
          },
        });

        const data = await response.json();
        if (data.status === "success") {
          setAlertas(data.alerts); // Guardar alertas en el estado
        }
      } catch (error) {
        console.error("Error al obtener alertas:", error);
      }
    };

    fetchAlertas(); // Llamada a la función para obtener alertas
  }, []);

  const savePublication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Recoger datos del formulario
    let newAlert = {
      user_id: auth._id,
      disaster_type: form.disaster_type,
      country: form.country,
      city: form.city,
      latitude: form.latitude,
      longitude: form.longitude,
      description: form.description,
    };

    console.log("Datos del formulario:", newAlert);

    // Verificar si hay una imagen seleccionada
    const fileInput = document.querySelector("#image");

    if (fileInput.files[0]) {
      const formData = new FormData();

      // Agregar el resto de los campos a formData
      formData.append("user_id", newAlert.user_id);
      formData.append("disaster_type", newAlert.disaster_type);
      formData.append("country", newAlert.country);
      formData.append("city", newAlert.city);
      formData.append("latitude", newAlert.latitude);
      formData.append("longitude", newAlert.longitude);
      formData.append("description", newAlert.description);
      formData.append("file", fileInput.files[0]); // Enviar el archivo como 'file'

      console.log("FormData con imagen:", Array.from(formData));

      // Hacer request para guardar en la base de datos
      const request = await fetch(Global.url + "/meteoinfo/alertas/report", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": token,
        },
      });

      const data = await request.json();

      console.log("Respuesta del servidor:", data);

      // Mostrar mensaje de éxito o error
      if (data.status === "success") {
        setStored("stored");
      } else {
        setStored("error");
      }
    } else {
      // Si no hay imagen, envía solo los datos del formulario
      console.log("Enviando solo datos del formulario");

      const request = await fetch(Global.url + "/meteoinfo/alertas/report", {
        method: "POST",
        body: JSON.stringify(newAlert),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });

      const data = await request.json();

      console.log("Respuesta del servidor (sin imagen):", data);

      if (data.status === "success") {
        setStored("stored");
      } else {
        setStored("error");
      }
    }

    const myForm = document.querySelector("#publication-form");
    if (myForm) {
      myForm.reset();
    }
  };

  // Función para mostrar la siguiente alerta
  const handleNextAlerta = () => {
    if (currentAlertaIndex < alertas.length - 1) {
      setCurrentAlertaIndex(currentAlertaIndex + 1);
    }
  };

  // Función para mostrar la alerta anterior
  const handlePreviousAlerta = () => {
    if (currentAlertaIndex > 0) {
      setCurrentAlertaIndex(currentAlertaIndex - 1);
    }
  };

  // Mostrar la alerta solo por 3 segundos
  useEffect(() => {
    if (stored === "stored" || stored === "error") {
      const timer = setTimeout(() => {
        setStored("not_stored"); // Oculta el mensaje después de 3 segundos
      }, 3000);

      return () => clearTimeout(timer); // Limpia el timeout cuando el componente se desmonte o cambie stored
    }
  }, [stored]);

  // Debouncing: para evitar hacer demasiadas llamadas a la API
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

          // Solo centra el mapa y hace zoom una vez al presionar el botón
          if (mapInstance) {
            mapInstance.setView([latitude, longitude], 12); // Centra el mapa en la nueva ubicación con zoom
          }
        },
        (error) => {
          console.error("Error obteniendo la geolocalización:", error);
        }
      );
    } else {
      console.log("La geolocalización no está soportada por este navegador.");
    }
  };

  // Función para capturar coordenadas al presionar 'P'
  const handleMapKeydown = (e) => {
    if (e.key === 'p' || e.key === 'P') {
      if (hoverPosition) {
        document.getElementById("latitude").value = hoverPosition.lat;
        document.getElementById("longitude").value = hoverPosition.lon;
      }
    }
  };

  return (
    <div className="parent">
      <div className="div1">
        <button onClick={handleLocationClick}>Usar mi ubicación actual</button>
        <MapContainer
          center={currentPosition}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          whenCreated={setMapInstance}
          scrollWheelZoom={true} // Habilitamos el zoom con la rueda del ratón
          dragging={true}       // Permite arrastrar el mapa
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
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
                  <p><strong>Latitud:</strong> {hoverPosition.lat}</p>
                  <p><strong>Longitud:</strong> {hoverPosition.lon}</p>
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

      <div className="div2">
        <h2>Alerta Reciente</h2>
        {alertas.length > 0 ? (
          <div className="alerta-card">
            <div>
              <h3>{alertas[currentAlertaIndex].disaster_type}</h3>
              <p><strong>Descripción:</strong> {alertas[currentAlertaIndex].description}</p>
              <p><strong>País:</strong> {alertas[currentAlertaIndex].country}</p>
              <p><strong>Ciudad:</strong> {alertas[currentAlertaIndex].city}</p>
              <p><strong>Latitud:</strong> {alertas[currentAlertaIndex].latitude}</p>
              <p><strong>Longitud:</strong> {alertas[currentAlertaIndex].longitude}</p>
            </div>
            {alertas[currentAlertaIndex].file && (
              <div className="alerta-imagen">
                <img src={alertas[currentAlertaIndex].file} alt="Imagen de alerta" style={{ width: '100%', height: '100%' }} />
              </div>
            )}
          </div>
        ) : (
          <p>No hay alertas disponibles.</p>
        )}
        <div className="alerta-navigation">
          <button onClick={handlePreviousAlerta} disabled={currentAlertaIndex === 0}>Anterior</button>
          <button onClick={handleNextAlerta} disabled={currentAlertaIndex === alertas.length - 1}>Siguiente</button>
        </div>
      </div>

      <div className="div3">
        {stored === "stored" && <strong className="alert alert-success"> ¡¡Alerta Publicada Correctamente!!</strong>}
        {stored === "error" && <strong className="alert alert-danger"> ¡¡No se ha podido publicar la alerta!!</strong>}

        <h2>Reportar Alerta</h2>
        <form id="publication-form" onSubmit={savePublication} className="report-form">
          <div className="input-box1">
            <input type="text" placeholder="Tipo de desastre" id="disaster_type" name="disaster_type" required onChange={changed} />
          </div>

          <div className="input-box1">
            <textarea id="description" placeholder="Descripción" name="description" required onChange={changed}></textarea>
          </div>

          <div className="input-box1">
            <input type="text" placeholder="Pais" id="country" name="country" required onChange={changed} />
          </div>

          <div className="input-box1">
            <input type="text" placeholder="Ciudad" id="city" name="city" required onChange={changed} />
          </div>

          <div className="input-box1">
            <input type="number" placeholder="Latitud" id="latitude" name="latitude" required step="any" onChange={changed} value={form.latitude || ''} />
          </div>

          <div className="input-box1">
            <input type="number" placeholder="Longitud" id="longitude" name="longitude" required step="any" onChange={changed} value={form.longitude || ''} />
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen:</label>
            <input type="file" id="image" name="image" />
          </div>

          <button type="submit" className="submit-btn">Enviar Alerta</button>
        </form>
      </div>
    </div>
  );
};

export default PagePrincipalPriv;
