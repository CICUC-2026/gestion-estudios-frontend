const indicadores = [
  { etiqueta: 'Estudios activos', valor: '8', detalle: '3 con cupos disponibles' },
  { etiqueta: 'Revisiones pendientes', valor: '6', detalle: 'Casos ficticios' },
  { etiqueta: 'Cupos por actualizar', valor: '2', detalle: 'Fuentes demo vencidas' },
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
        <ul className="lista-actividad">
          <li><strong>09:45</strong><span>Se generó el resumen operativo semanal</span></li>
          <li><strong>09:31</strong><span>Se actualizaron cupos del estudio Aurora</span></li>
          <li><strong>Ayer</strong><span>PX-DEMO-0021 pasó a revisión manual</span></li>
        </ul>
      </section>
    </>
  )
}
