import { Link } from "react-router-dom";
import { useState } from 'react';

export const Sidebar = () => {
  return (
    <aside className="layout__aside">
      <header className="aside__header">
        <h1 className="aside__title">Hola, {auth.name} </h1>
      </header>
      <div className="aside__container">
      </div>
    </aside>
  );
};