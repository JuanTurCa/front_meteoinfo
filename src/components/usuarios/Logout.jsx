import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const Logout = () => {
  // Se reciben los métodos setAuth y setCounters
  const { setAuth, setCounters } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vaciar el local storage
    localStorage.clear();

    // Setear estados globales a vacío
    setAuth({});
    setCounters({});

    // Navigate (redirección) al login
    navigate("/home");
  }, []); // Se añade un array de dependencias vacío para que solo se ejecute una vez

  return (
    <h1>Cerrando sesión...</h1>
  );
};
