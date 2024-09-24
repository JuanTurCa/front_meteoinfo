import { Link } from 'react-router-dom';
import '../../assets/css/error404.css';
import { useEffect } from 'react';
import Confetti from 'react-confetti'; // Un paquete de confeti para hacerlo más llamativo
import image from '../../assets/img/error.jpg';


export const Error404 = () => {
  return (
    <div className="error-container">
      <Confetti /> {/* Añade confeti para darle un toque festivo */}
      <img src={image} alt="404 Error" className="error-image" />
      <h1>¡Ups! Parece que te perdiste...</h1>
      <p className="error-message">
        La página que buscas no existe. Pero no te preocupes, ¡puedes volver al buen camino!
      </p>
      <Link to="/" className="error-button">
        Volver al inicio
      </Link>
    </div>
  );
};
