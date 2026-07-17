import { NavLink, Outlet } from 'react-router-dom'

import { useSesion } from '../dominios/autenticacion/sesionContexto'

const navegacion = [
  { etiqueta: 'Inicio', ruta: '/' },
  { etiqueta: 'Estudios', ruta: '/estudios' },
  { etiqueta: 'Pacientes', ruta: '/pacientes' },
  { etiqueta: 'Operación', ruta: '/operacion' },
  { etiqueta: 'Reportes', ruta: '/reportes' },
]

export function LayoutPrincipal() {
  const { usuario, salir } = useSesion()
  const iniciales = `${usuario?.nombres.at(0) ?? ''}${usuario?.apellidos.at(0) ?? ''}`
  return (
    <div className="aplicacion">
      <header className="barra-superior">
        <a className="marca" href="/" aria-label="CICUC, ir al inicio">
          <span className="marca-simbolo" aria-hidden="true">C</span>
          <span>
            <strong>CICUC</strong>
            <small>Gestión de estudios</small>
          </span>
        </a>

        <nav aria-label="Navegación principal">
          <ul className="navegacion-principal">
            {navegacion.map((item) => (
              <li key={item.ruta}>
                <NavLink
                  className={({ isActive }) => (isActive ? 'enlace activo' : 'enlace')}
                  end={item.ruta === '/'}
                  to={item.ruta}
                >
                  {item.etiqueta}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="acciones-barra">
          <button className="boton-icono" type="button" aria-label="Buscar">⌕</button>
          <button className="boton-icono" type="button" aria-label="Notificaciones">○</button>
          <button
            className="cuenta"
            type="button"
            aria-label="Cerrar sesión"
            onClick={() => void salir()}
          >
            <span aria-hidden="true">{iniciales}</span>
            <span className="cuenta-texto">{usuario?.nombres} · Salir</span>
          </button>
        </div>
      </header>

      <main id="contenido-principal" className="contenido">
        <Outlet />
      </main>
    </div>
  )
}
