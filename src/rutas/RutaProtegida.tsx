import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useSesion } from '../dominios/autenticacion/sesionContexto'

export function RutaProtegida() {
  const { usuario, cargando } = useSesion()
  const ubicacion = useLocation()

  if (cargando) {
    return (
      <main className="pantalla-carga" aria-live="polite">
        <span className="indicador-carga" aria-hidden="true" />
        Validando sesión…
      </main>
    )
  }
  if (!usuario) {
    return <Navigate replace state={{ desde: ubicacion }} to="/ingresar" />
  }
  return <Outlet />
}
