import { Navigate, Outlet } from "react-router-dom";
import { HeaderPriv } from "./HeaderPriv"
import { Sidebar } from "./Sidebar"


export const PrivateLayout = () => {
    return (
      <>
        {/* Cabecera y navegación*/}
        <HeaderPriv />

        {/* Contenido Principal */}
        <section>
          <Navigate to="/home" />
        </section>

        {/* Barra Lateral */}
        <Sidebar />

      </>
    );
  }