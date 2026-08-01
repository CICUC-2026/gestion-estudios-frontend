import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { useSesion } from '../dominios/autenticacion/sesionContexto'
import { useTema, type TipoTema } from './temaContexto'


const navegacion = [
  { etiqueta: 'Inicio', ruta: '/', icono: '⌂' },
  { etiqueta: 'Estudios', ruta: '/estudios', icono: '▤' },
  { etiqueta: 'Pacientes', ruta: '/pacientes', icono: '♙' },
  { etiqueta: 'Operación', ruta: '/operacion', icono: '✓' },
  { etiqueta: 'Reportes', ruta: '/reportes', icono: '▥' },
]

export function LayoutPrincipal() {
  const { usuario, salir } = useSesion()
  const { tema, cambiarTema } = useTema()
  const ubicacion = useLocation()
  const iniciales = `${usuario?.nombres.at(0) ?? ''}${usuario?.apellidos.at(0) ?? ''}`
  const pagina = navegacion.find((item) => item.ruta === ubicacion.pathname)?.etiqueta ?? 'CICUC'
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="shell">
      <header className="cabecera-principal">
        <a className="logo" href="/" aria-label="CICUC, ir al inicio">
          <span className="logo-marca"><span className="logo-punto" />CICUC</span>
          <span className="logo-sub">Gestión de estudios clínicos</span>
        </a>

        <button
          className="boton-menu"
          type="button"
          aria-label={menuAbierto ? 'Cerrar menú principal' : 'Abrir menú principal'}
          aria-expanded={menuAbierto}
          aria-controls="navegacion-principal"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span aria-hidden="true">{menuAbierto ? '×' : '☰'}</span>
        </button>

        <nav id="navegacion-principal" className={menuAbierto ? 'nav abierto' : 'nav'} aria-label="Navegación principal">
          {navegacion.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-item activo' : 'nav-item')}
              end={item.ruta === '/'}
              key={item.ruta}
              to={item.ruta}
              onClick={() => setMenuAbierto(false)}
            >
              <span className="nav-icono" aria-hidden="true">{item.icono}</span>
              <span>{item.etiqueta}</span>
              {item.etiqueta === 'Operación' ? <span className="nav-badge" aria-label="11 elementos en operación">11</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="acciones-cabecera">
          <label htmlFor="selector-tema-select" className="sr-only">Tema visual</label>
          <select id="selector-tema-select" className="select-tema" value={tema} onChange={(e) => cambiarTema(e.target.value as TipoTema)} aria-label="Seleccionar tema visual">
            <option value="estandar">Tema estándar</option>
            <option value="alto-contraste">Alto contraste</option>
            <option value="daltonismo">Daltonismo</option>
          </select>
          <button className="avatar" type="button" onClick={() => void salir()} aria-label={`Cerrar sesión de ${usuario?.nombres ?? 'usuario'}`}>{iniciales}</button>
        </div>
      </header>

      <div className="area-principal">
        <header className="topbar">
          <div className="breadcrumb"><span>Gestión de estudios</span><b>/</b><strong>{pagina}</strong></div>
        </header>


        <main id="contenido-principal" className="contenido"><Outlet /></main>
      </div>
    </div>
  )
}
