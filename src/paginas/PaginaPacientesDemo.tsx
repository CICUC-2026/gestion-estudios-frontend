import { useState } from 'react'

import { guardarPacientesDemo, leerPacientesDemo, pacientesDemoIniciales, reiniciarPacientesDemo, type PacienteDemo } from '../dominios/pacientes/pacientesDemo'

const rangos = ['18–34 años', '35–49 años', '50–64 años', '65–79 años', '80 años o más']
const estados = ['Antecedentes pendientes', 'Revisión administrativa', 'Información incompleta', 'Seguimiento cerrado']

export function PaginaPacientesDemo() {
  const [pacientes, setPacientes] = useState<PacienteDemo[]>(leerPacientesDemo)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [rangoEtario, setRangoEtario] = useState('18–34 años')
  const [patologia, setPatologia] = useState('')
  const [estado, setEstado] = useState('Antecedentes pendientes')
  const [mensaje, setMensaje] = useState<string | null>(null)

  function guardar(evento: React.FormEvent) {
    evento.preventDefault()
    const nuevo: PacienteDemo = { id: crypto.randomUUID(), codigo: codigo.trim().toUpperCase(), rangoEtario, patologia: patologia.trim(), estado }
    const actualizados = [...pacientes, nuevo]
    guardarPacientesDemo(actualizados)
    setPacientes(actualizados)
    setCodigo('')
    setPatologia('')
    setMostrarFormulario(false)
    setMensaje('Caso ficticio guardado únicamente en este navegador.')
  }

  function reiniciar() {
    reiniciarPacientesDemo()
    setPacientes(pacientesDemoIniciales)
    setMensaje('Datos locales eliminados; se restauró el caso ficticio inicial.')
  }

  return <>
    <section className="encabezado-pagina">
      <div><p className="sobrelinea">Prototipo local · No clínico</p><h1>Pacientes</h1><p>Casos ficticios y minimizados para grabar la demostración. No se envían ni sincronizan con el servidor.</p></div>
      <button className="boton-primario" type="button" onClick={() => setMostrarFormulario(true)}>Agregar caso ficticio</button>
    </section>
    <aside className="aviso-prototipo" aria-label="Limitaciones del prototipo"><strong>⚠ Solo demostración</strong><span>Los datos viven en este navegador. No uses nombres, RUT, contactos ni información de personas reales. Esto no determina elegibilidad.</span></aside>
    {mensaje ? <p className="mensaje-accion-demo" role="status">{mensaje}</p> : null}
    {mostrarFormulario ? <form className="formulario-paciente-demo" onSubmit={guardar}>
      <label>Código ficticio<input required pattern="PX-DEMO-[A-Z0-9-]+" placeholder="PX-DEMO-0021" value={codigo} onChange={(evento) => setCodigo(evento.target.value)} /></label>
      <label>Rango etario<select value={rangoEtario} onChange={(evento) => setRangoEtario(evento.target.value)}>{rangos.map((rango) => <option key={rango}>{rango}</option>)}</select></label>
      <label>Patología ficticia<input required placeholder="Patología ficticia B" value={patologia} onChange={(evento) => setPatologia(evento.target.value)} /></label>
      <label>Estado administrativo<select value={estado} onChange={(evento) => setEstado(evento.target.value)}>{estados.map((opcion) => <option key={opcion}>{opcion}</option>)}</select></label>
      <div className="acciones-formulario"><button className="boton-primario" type="submit">Guardar en este navegador</button><button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button></div>
    </form> : null}
    <section className="panel-tabla"><div className="cabecera-tabla"><div><p className="sobrelinea">Datos locales ficticios</p><h2>Casos de demostración</h2></div><div className="acciones-tabla"><span>{pacientes.length} registros</span><button type="button" onClick={reiniciar}>Reiniciar demo</button></div></div><div className="tabla-desplazable"><table><thead><tr><th>Código</th><th>Rango etario</th><th>Patología ficticia</th><th>Seguimiento</th></tr></thead><tbody>{pacientes.map((paciente) => <tr key={paciente.id}><td data-label="Código">{paciente.codigo}</td><td data-label="Rango etario">{paciente.rangoEtario}</td><td data-label="Patología ficticia">{paciente.patologia}</td><td data-label="Seguimiento">{paciente.estado}</td></tr>)}</tbody></table></div></section>
  </>
}
