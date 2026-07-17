import { Link } from 'react-router-dom'

export function PaginaNoEncontrada() {
  return (
    <section className="panel-vacio">
      <p className="sobrelinea">Error 404</p>
      <h1>Página no encontrada</h1>
      <p>La dirección solicitada no existe o todavía no está disponible.</p>
      <Link className="boton-primario" to="/">Volver al inicio</Link>
    </section>
  )
}
