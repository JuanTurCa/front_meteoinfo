import { Navigate, Outlet } from "react-router-dom";
import { HeaderPriv } from "./HeaderPriv"
import useAuth from '../../../hooks/useAuth';


export const PrivateLayout = () => {

  const { auth, loading } = useAuth();

  if (loading) {
    return <h1>Cargando...</h1>
  } else {
    return (
      <>
        {/* Cabecera y navegación*/}
        <HeaderPriv />

        {/* Contenido Principal */}
        <section >
          {auth._id ?
            <Outlet />
            :
            <Navigate to="/home" />
          }
        </section>
      </>
    );
  }
}