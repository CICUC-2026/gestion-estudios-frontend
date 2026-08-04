import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useSesion } from "../dominios/autenticacion/sesionContexto";
import { useTema, type TipoTema } from "./temaContexto";

const navegacion = [
  { etiqueta: "Inicio", ruta: "/", icono: "⌂" },
  { etiqueta: "Estudios", ruta: "/estudios", icono: "▤" },
  { etiqueta: "Pacientes", ruta: "/pacientes", icono: "♙" },
  { etiqueta: "Preselección", ruta: "/preseleccion", icono: "◇" },
  { etiqueta: "Operación", ruta: "/operacion", icono: "✓" },
  { etiqueta: "Reportes", ruta: "/reportes", icono: "▥" },
];

export function LayoutPrincipal() {
  const { usuario, salir } = useSesion();
  const { tema, cambiarTema } = useTema();
  const ubicacion = useLocation();
  const iniciales = `${usuario?.nombres.at(0) ?? ""}${usuario?.apellidos.at(0) ?? ""}`;
  const pagina =
    navegacion.find((item) => item.ruta === ubicacion.pathname)?.etiqueta ??
    "CICUC";

  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="logo" href="/" aria-label="CICUC, ir al inicio">
          <span className="logo-marca">
            <span className="logo-punto" />
            CICUC
          </span>
          <span className="logo-sub">Gestión de estudios clínicos</span>
        </a>

        <nav className="nav" aria-label="Navegación principal">
          <p className="nav-seccion">Plataforma</p>
          {navegacion.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-item activo" : "nav-item"
              }
              end={item.ruta === "/"}
              key={item.ruta}
              to={item.ruta}
            >
              <span className="nav-icono" aria-hidden="true">
                {item.icono}
              </span>
              <span>{item.etiqueta}</span>
              {item.etiqueta === "Operación" ? (
                <span
                  className="nav-badge"
                  aria-label="11 elementos en operación"
                >
                  11
                </span>
              ) : null}
            </NavLink>
          ))}
          <p className="nav-seccion nav-seccion-secundaria">Administración</p>
          <span className="nav-item nav-item-inactivo">
            <span className="nav-icono" aria-hidden="true">
              ⚙
            </span>
            Configuración
          </span>
          <span className="nav-item nav-item-inactivo">
            <span className="nav-icono" aria-hidden="true">
              ◉
            </span>
            Auditoría
          </span>
        </nav>

        <button
          className="usuario-sidebar"
          type="button"
          onClick={() => void salir()}
          aria-label="Cerrar sesión"
        >
          <span className="avatar">{iniciales}</span>
          <span>
            <strong>
              {usuario?.nombres} {usuario?.apellidos}
            </strong>
            <small>Administrador · Salir</small>
          </span>
        </button>
      </aside>

      <div className="area-principal">
        <header className="topbar">
          <a className="marca-mobile" href="/" aria-label="CICUC, ir al inicio">
            <span className="logo-punto" />
            CICUC
          </a>
          <div className="breadcrumb">
            <span>Gestión de estudios</span>
            <b>/</b>
            <strong>{pagina}</strong>
          </div>
          <div className="acciones-topbar">
            <div className="selector-tema-contenedor">
              <label htmlFor="selector-tema-select" className="sr-only">
                Tema visual
              </label>
              <select
                id="selector-tema-select"
                className="select-tema"
                value={tema}
                onChange={(e) => cambiarTema(e.target.value as TipoTema)}
                aria-label="Seleccionar tema visual"
              >
                <option value="estandar">Verde Opaco (Estándar)</option>
                <option value="alto-contraste">Alto Contraste</option>
                <option value="daltonismo">Adaptado Daltonismo</option>
              </select>
            </div>
            <button className="icon-btn" type="button" aria-label="Buscar">
              ⌕
            </button>
            <button
              className="icon-btn"
              type="button"
              aria-label="Notificaciones"
            >
              ○
              <span className="alerta-punto" aria-hidden="true">
                ▲
              </span>
            </button>
            <button
              className="avatar salir-mobile"
              type="button"
              onClick={() => void salir()}
              aria-label="Cerrar sesión"
            >
              {iniciales}
            </button>
          </div>
        </header>

        <main id="contenido-principal" className="contenido">
          <Outlet />
        </main>

        <nav className="nav-mobile" aria-label="Navegación principal">
          {navegacion.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-mobile-item activo" : "nav-mobile-item"
              }
              end={item.ruta === "/"}
              key={item.ruta}
              to={item.ruta}
            >
              <span aria-hidden="true">{item.icono}</span>
              <small>{item.etiqueta}</small>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
