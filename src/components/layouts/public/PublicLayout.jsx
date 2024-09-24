import { Navigate, Outlet } from "react-router-dom";
import { HeaderPub } from "./HeaderPub";


export const PublicLayout = () => {
  return (
    <>
      {/* Cabecera y Navegación Pública*/}
      <HeaderPub />

      {/* Contenido Principal */}
      <section className='layout__content'>
      </section>
    </>
  )
}