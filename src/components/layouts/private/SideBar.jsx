import { Link } from "react-router-dom";
import { useState } from 'react';
import avatar from "../../../assets/img/default.png";

export const Sidebar = () => {
  const savePublication = async (e) => {
    e.preventDefault();
  }

  return (
    <aside className="layout__aside">

      <header className="aside__header">
        <h1 className="aside__title">Hola, MeteoInfo </h1>
      </header>

      <div className="aside__container">

        <div className="aside__profile-info">

          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};