import { NavLink } from "react-router-dom";
import avatar from "../../../assets/img/default.png";
import useAuth from "../../../hooks/useAuth";

export const NavPriv = () => {
  const { auth } = useAuth();

  return (
    <nav className="navbar__container-lists">
      {/* Menú principal */}
      <ul className="container-lists__menu-list">
        <li className="menu-list__item">
          <NavLink to="/rsocial" className="menu-list__link">
            <i className="fa-solid fa-house"></i>
            <span className="menu-list__title">Inicio</span>
          </NavLink>
        </li>
        <li className="menu-list__item">
          <NavLink to="/rsocial/feed" className="menu-list__link">
            <i className="fa-solid fa-list"></i>
            <span className="menu-list__title">Timeline</span>
          </NavLink>
        </li>
        <li className="menu-list__item">
          <NavLink to="/rsocial/gente" className="menu-list__link">
            <i className="fa-solid fa-users"></i>
            <span className="menu-list__title">Gente</span>
          </NavLink>
        </li>
      </ul>

      {/* Sección de avatar y enlaces finales */}
      <ul className="container-lists__list-end">
        <li className="list-end__item">
          <div className="img-avatar-nav">
          {auth.image != "default.png" && (
              <img
                src={auth.image}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
            {auth.image == "default.png" && (
              <img
                src={avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
          </div>
        </li>

        <li className="list-end__item">
          <a href="#" className="list-end__link">
            <i className="fa-solid fa-gear"></i>
            <span style={{ color: '#fff' }}>{auth?.nick || "Usuario"}</span>
          </a>
        </li>
        <li>
          <NavLink to="/rsocial/ajustes" className="list-end__link">
            <span >Ajustes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/rsocial/logout" className="list-end__link">
            <span>Cerrar sesión</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
