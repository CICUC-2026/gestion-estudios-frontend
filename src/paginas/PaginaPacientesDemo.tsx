import { useEffect, useState } from 'react'

import { actualizarPacienteDemo, asociarEstudioDemo, crearDiagnosticoDemo, crearPacienteDemo, obtenerPacientesDemo, type EstadoPacienteDemo, type PacienteDemo } from '../dominios/pacientes/apiPacientes'
import { obtenerEstudios } from '../dominios/estudios/apiEstudios'
import type { Estudio } from '../dominios/estudios/tipos'

const rangos = ['18–34 años', '35–49 años', '50–64 años', '65–79 años', '80 años o más']
const estados: Array<[EstadoPacienteDemo, string]> = [['antecedentes_pendientes', 'Antecedentes pendientes'], ['revision_administrativa', 'Revisión administrativa'], ['informacion_incompleta', 'Información incompleta'], ['seguimiento_cerrado', 'Seguimiento cerrado']]

export function PaginaPacientesDemo() {
  const [pacientes, setPacientes] = useState<PacienteDemo[]>([])
  const [estudios, setEstudios] = useState<Estudio[]>([])
  const [seleccionado, setSeleccionado] = useState<PacienteDemo | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [rangoEtario, setRangoEtario] = useState(rangos[0] ?? '18–34 años')
  const [patologia, setPatologia] = useState('')
  const [estado, setEstado] = useState<EstadoPacienteDemo>('antecedentes_pendientes')
  const [diagnostico, setDiagnostico] = useState('')
  const [biomarcador, setBiomarcador] = useState('')
  const [estudioId, setEstudioId] = useState('')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  async function recargar() {
    const [casos, inventario] = await Promise.all([obtenerPacientesDemo(), obtenerEstudios()])
    setPacientes(casos); setEstudios(inventario); setEstudioId((actual) => actual || inventario[0]?.id || '')
  }

  useEffect(() => {
    void Promise.all([obtenerPacientesDemo(), obtenerEstudios()])
      .then(([casos, inventario]) => {
        setPacientes(casos)
        setEstudios(inventario)
        setEstudioId(inventario[0]?.id ?? '')
      })
      .catch(() => setMensaje('No fue posible cargar pacientes desde la API.'))
      .finally(() => setCargando(false))
  }, [])

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault()
    try {
      await crearPacienteDemo({ codigo: codigo.trim().toUpperCase(), rango_etario: rangoEtario, patologia: patologia.trim(), estado })
      await recargar(); setCodigo(''); setPatologia(''); setMostrarFormulario(false)
      setMensaje('Paciente sintético persistido en PostgreSQL.')
    } catch { setMensaje('No fue posible guardar el paciente sintético.') }
  }

  async function guardarDiagnostico(evento: React.FormEvent) {
    evento.preventDefault(); if (!seleccionado) return
    try {
      await crearDiagnosticoDemo(seleccionado.id, { diagnostico, biomarcador: biomarcador || undefined, fecha: new Date().toISOString().slice(0, 10), fuente: 'Registro manual sintético' })
      setDiagnostico(''); setBiomarcador(''); setMensaje('Antecedente ficticio persistido y auditado.')
    } catch { setMensaje('No fue posible guardar el antecedente.') }
  }

  async function asociar() {
    if (!seleccionado || !estudioId) return
    try { await asociarEstudioDemo(seleccionado.id, estudioId); setMensaje('Paciente asociado administrativamente al estudio; no implica elegibilidad.') } catch { setMensaje('No fue posible asociar el estudio o la asociación ya existe.') }
  }

  async function archivar(paciente: PacienteDemo) {
    await actualizarPacienteDemo(paciente.id, { archivado: true }); setSeleccionado(null); await recargar(); setMensaje('Paciente sintético archivado sin borrado físico.')
  }

  return <>
    <section className="encabezado-pagina"><div><p className="sobrelinea">Demo persistente · No clínica</p><h1>Pacientes</h1><p>Casos sintéticos almacenados en PostgreSQL para demostrar seguimiento administrativo.</p></div><button className="boton-primario" type="button" onClick={() => setMostrarFormulario(true)}>Agregar paciente sintético</button></section>
    <aside className="aviso-prototipo"><strong>⚠ Solo datos ficticios</strong><span>No uses nombres, RUT, contactos ni información real. Ninguna asociación determina elegibilidad.</span></aside>
    {mensaje ? <p className="mensaje-accion-demo" role="status">{mensaje}</p> : null}
    {mostrarFormulario ? <form className="formulario-paciente-demo" onSubmit={(evento) => void guardar(evento)}><label>Código ficticio<input required pattern="PX-DEMO-[A-Z0-9-]+" placeholder="PX-DEMO-0042" value={codigo} onChange={(e) => setCodigo(e.target.value)} /></label><label>Rango etario<select value={rangoEtario} onChange={(e) => setRangoEtario(e.target.value)}>{rangos.map((r) => <option key={r}>{r}</option>)}</select></label><label>Patología ficticia<input required value={patologia} onChange={(e) => setPatologia(e.target.value)} /></label><label>Estado<select value={estado} onChange={(e) => setEstado(e.target.value as EstadoPacienteDemo)}>{estados.map(([valor, etiqueta]) => <option value={valor} key={valor}>{etiqueta}</option>)}</select></label><div className="acciones-formulario"><button className="boton-primario" type="submit">Guardar en PostgreSQL</button><button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button></div></form> : null}
    <section className="panel-tabla"><div className="cabecera-tabla"><div><p className="sobrelinea">Fuente API</p><h2>Pacientes sintéticos</h2></div><span>{pacientes.length} registros</span></div><div className="tabla-desplazable"><table><thead><tr><th>Código</th><th>Rango etario</th><th>Patología</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{cargando ? <tr><td colSpan={5}>Cargando…</td></tr> : pacientes.length === 0 ? <tr><td colSpan={5}>No hay pacientes sintéticos todavía.</td></tr> : pacientes.map((p) => <tr key={p.id}><td data-label="Código">{p.codigo}</td><td data-label="Rango etario">{p.rango_etario}</td><td data-label="Patología">{p.patologia}</td><td data-label="Estado">{estados.find(([v]) => v === p.estado)?.[1] ?? p.estado}</td><td data-label="Acciones"><div className="acciones-tabla"><button type="button" onClick={() => setSeleccionado(p)}>Gestionar</button><button type="button" onClick={() => void archivar(p)}>Archivar</button></div></td></tr>)}</tbody></table></div></section>
    {seleccionado ? <section className="panel-vacio"><p className="sobrelinea">Gestión de {seleccionado.codigo}</p><h2>Antecedentes y estudios</h2><form className="formulario-paciente-demo" onSubmit={(e) => void guardarDiagnostico(e)}><label>Diagnóstico ficticio<input required value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} /></label><label>Biomarcador ficticio<input value={biomarcador} onChange={(e) => setBiomarcador(e.target.value)} /></label><div className="acciones-formulario"><button className="boton-primario" type="submit">Guardar antecedente</button></div></form><div className="formulario-paciente-demo"><label>Estudio<select value={estudioId} onChange={(e) => setEstudioId(e.target.value)}>{estudios.map((item) => <option value={item.id} key={item.id}>{item.codigo_interno} · {item.titulo}</option>)}</select></label><div className="acciones-formulario"><button className="boton-primario" type="button" onClick={() => void asociar()}>Asociar para revisión</button></div></div></section> : null}
  </>
}
