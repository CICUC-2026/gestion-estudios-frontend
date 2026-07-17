const indicadores = [
  { etiqueta: 'Estudios activos', valor: '—', detalle: 'Sin datos conectados' },
  { etiqueta: 'Revisiones pendientes', valor: '—', detalle: 'Sin datos conectados' },
  { etiqueta: 'Cupos por actualizar', valor: '—', detalle: 'Sin datos conectados' },
]

export function PaginaInicio() {
  return (
    <>
      <section className="encabezado-pagina">
        <div>
          <p className="sobrelinea">Resumen operativo</p>
          <h1>Buenos días</h1>
          <p>La plataforma está preparada para incorporar módulos en incrementos verificados.</p>
        </div>
        <div className="estado-entorno">
          <span aria-hidden="true" /> Datos de demostración
        </div>
      </section>

      <section aria-labelledby="titulo-indicadores">
        <h2 id="titulo-indicadores" className="titulo-seccion">Estado de la unidad</h2>
        <div className="rejilla-indicadores">
          {indicadores.map((indicador) => (
            <article className="tarjeta-indicador" key={indicador.etiqueta}>
              <p>{indicador.etiqueta}</p>
              <strong>{indicador.valor}</strong>
              <small>{indicador.detalle}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-vacio" aria-labelledby="titulo-actividad">
        <div>
          <p className="sobrelinea">Trazabilidad</p>
          <h2 id="titulo-actividad">Actividad reciente</h2>
        </div>
        <p>No hay actividad todavía. Los módulos se habilitarán según el backlog aprobado.</p>
      </section>
    </>
  )
}
