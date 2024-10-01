import { NavPub } from "./NavPub"
import PagePrincipal from "./PagePrincipal"

export const HeaderPub = () => {
  return (
    <header className="layout__navbar">
      <div className="navbar__header">
        {/* Título */}
        <a href="#" className="navbar__title">MeteoInfo</a>
      </div>
      {/* El componente de navegación pública */}
      <NavPub />
    </header>

  )
}
