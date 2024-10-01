import { Outlet } from "react-router-dom";
import { HeaderPub } from "./HeaderPub";

export const PublicLayout = () => {
  return (
    <>
      {/* Cabecera y Navegación Pública */}
      <HeaderPub />

      {/* Contenido Principal */}
      <section>
        <Outlet /> {/* Este es necesario para renderizar las rutas anidadas */}
      </section>
    </>
  );
}