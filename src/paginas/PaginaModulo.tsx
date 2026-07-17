type Propiedades = {
  titulo: string
}

export function PaginaModulo({ titulo }: Propiedades) {
  return (
    <section className="encabezado-pagina">
      <div>
        <p className="sobrelinea">Módulo planificado</p>
        <h1>{titulo}</h1>
        <p>Esta capacidad todavía no está implementada. Se activará mediante una HU verificable.</p>
      </div>
    </section>
  )
}
