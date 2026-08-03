import { useEffect, useState } from 'react'

import { crearTarea, obtenerReportes, obtenerTareas, prepararReporte, type Reporte, type Tarea } from '../dominios/operacion/apiOperacion'

type Modulo = 'operacion' | 'reportes'
type Fila = Record<string, string>

const configuracion: Record<Modulo, { titulo: string; descripcion: string; accion: string; columnas: Array<[string, string]>; filas: Fila[] }> = {
  operacion: { titulo: 'Operación', descripcion: 'Tareas administrativas persistidas y auditadas.', accion: 'Nueva tarea', columnas: [['prioridad', 'Prioridad'], ['tarea', 'Tarea'], ['plazo', 'Plazo'], ['estado', 'Estado']], filas: [] },
  reportes: { titulo: 'Reportes', descripcion: 'Cortes operativos persistidos; no contienen interpretación clínica.', accion: 'Preparar reporte', columnas: [['reporte', 'Reporte'], ['corte', 'Fecha de corte'], ['alcance', 'Alcance'], ['estado', 'Estado']], filas: [] },
}

const filasTareas = (tareas: Tarea[]): Fila[] => tareas.map((tarea) => ({ prioridad: tarea.prioridad, tarea: tarea.titulo, plazo: tarea.vence_en ? new Date(tarea.vence_en).toLocaleString() : 'Sin definir', estado: tarea.estado.replace('_', ' ') }))
const filasReportes = (reportes: Reporte[]): Fila[] => reportes.map((reporte) => ({ reporte: reporte.nombre, corte: new Date(reporte.fecha_corte).toLocaleString(), alcance: `${reporte.contenido.estudios ?? 0} estudios · ${reporte.contenido.tareas_pendientes ?? 0} tareas pendientes`, estado: 'Disponible' }))

export function PaginaModulo({ modulo }: { modulo: Modulo }) {
  const datos = configuracion[modulo]
  const [filas, setFilas] = useState<Fila[]>(datos.filas)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (modulo === 'operacion') void obtenerTareas().then((items) => setFilas(filasTareas(items)))
    if (modulo === 'reportes') void obtenerReportes().then((items) => setFilas(filasReportes(items)))
  }, [modulo])

  async function ejecutarAccion() {
    if (modulo === 'operacion') {
      setMostrarFormulario(true)
      return
    }
    setGuardando(true)
    try {
      await prepararReporte()
      setFilas(filasReportes(await obtenerReportes()))
      setMensaje('Reporte operativo preparado y persistido en PostgreSQL.')
    } catch { setMensaje('No fue posible preparar el reporte.') } finally { setGuardando(false) }
  }

  async function guardarTarea(evento: React.FormEvent) {
    evento.preventDefault()
    setGuardando(true)
    try {
      await crearTarea(titulo)
      setFilas(filasTareas(await obtenerTareas()))
      setTitulo('')
      setMostrarFormulario(false)
      setMensaje('Tarea creada y persistida en PostgreSQL.')
    } catch { setMensaje('No fue posible crear la tarea.') } finally { setGuardando(false) }
  }

  return <>
    <section className="encabezado-pagina"><div><p className="sobrelinea">Operación CICUC</p><h1>{datos.titulo}</h1><p>{datos.descripcion}</p></div><button className="boton-primario" disabled={guardando} type="button" onClick={() => void ejecutarAccion()}>{guardando ? 'Guardando…' : datos.accion}</button></section>
    {mensaje ? <p className="mensaje-accion-demo" role="status">{mensaje}</p> : null}
    {mostrarFormulario ? <form className="formulario-tarea" onSubmit={(evento) => void guardarTarea(evento)}><label>Título de la tarea<input required value={titulo} onChange={(evento) => setTitulo(evento.target.value)} /></label><button className="boton-primario" disabled={guardando} type="submit">Guardar tarea</button></form> : null}
    <section className="panel-tabla"><div className="cabecera-tabla"><div><p className="sobrelinea">Datos persistidos</p><h2>Vista general</h2></div><span>{filas.length} registros</span></div><div className="tabla-desplazable"><table><thead><tr>{datos.columnas.map(([clave, etiqueta]) => <th key={clave}>{etiqueta}</th>)}</tr></thead><tbody>{filas.length === 0 ? <tr><td colSpan={datos.columnas.length}>No hay registros todavía.</td></tr> : filas.map((fila, indice) => <tr key={indice}>{datos.columnas.map(([clave, etiqueta]) => <td data-label={etiqueta} key={clave}>{fila[clave]}</td>)}</tr>)}</tbody></table></div></section>
  </>
}
