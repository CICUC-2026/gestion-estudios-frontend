import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { crearEstudio, obtenerEstudios } from '../dominios/estudios/apiEstudios'
import type { Estudio } from '../dominios/estudios/tipos'

export function PaginaEstudios() {
  const [estudios, setEstudios] = useState<Estudio[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [patologia, setPatologia] = useState('')
  const [estadoOperacional, setEstadoOperacional] = useState('')
  const [disponibilidad, setDisponibilidad] = useState('')
  const [vigencia, setVigencia] = useState('')

  // Modal Nuevo Estudio
  const [modalAbierto, setModalAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [formulario, setFormulario] = useState({
    codigo_interno: '',
    titulo: '',
    patrocinador: '',
    fase: 'Fase 3',
    patologia: '',
    escenario_clinico: 'Metastásico',
    linea_tratamiento: 'Primera línea',
    centro_atencion: 'CICUC San Joaquín',
    estado_operacional: 'activado',
    disponibilidad: 'con_cupo',
    fuente_informacion: 'Registro Manual Portal',
    observaciones: '',
  })

  useEffect(() => {
    let activo = true

    obtenerEstudios({
      patologia: patologia || undefined,
      estado_operacional: estadoOperacional || undefined,
      disponibilidad: disponibilidad || undefined,
      vigencia: vigencia || undefined,
    })
      .then((datos) => {
        if (activo) {
          setEstudios(datos)
          setCargando(false)
        }
      })
      .catch((err: unknown) => {
        if (activo) {
          setError(err instanceof Error ? err.message : 'Error al cargar estudios.')
          setCargando(false)
        }
      })

    return () => {
      activo = false
    }
  }, [patologia, estadoOperacional, disponibilidad, vigencia])

  async function handleCrearEstudio(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    try {
      await crearEstudio(formulario)
      setModalAbierto(false)
      setFormulario({
        codigo_interno: '',
        titulo: '',
        patrocinador: '',
        fase: 'Fase 3',
        patologia: '',
        escenario_clinico: 'Metastásico',
        linea_tratamiento: 'Primera línea',
        centro_atencion: 'CICUC San Joaquín',
        estado_operacional: 'activado',
        disponibilidad: 'con_cupo',
        fuente_informacion: 'Registro Manual Portal',
        observaciones: '',
      })
      const datos = await obtenerEstudios({
        patologia: patologia || undefined,
        estado_operacional: estadoOperacional || undefined,
        disponibilidad: disponibilidad || undefined,
        vigencia: vigencia || undefined,
      })
      setEstudios(datos)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear estudio')
    } finally {
      setGuardando(false)
    }
  }

  const totalActivados = estudios.filter((e) => e.estado_operacional === 'activado').length
  const totalConCupo = estudios.filter((e) => e.disponibilidad === 'con_cupo').length
  const totalSinConfirmar = estudios.filter((e) => e.estado_operacional === 'sin_confirmar').length

  return (
    <>
      <section className="encabezado-pagina" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="sobrelinea">Inventario de Ensayos Oncológicos</p>
          <h1>Estudios Clínicos</h1>
          <p>Catálogo unificado con separación de estado operacional, disponibilidad y fuente de vigencia.</p>
        </div>
        <button
          type="button"
          className="boton-primario"
          onClick={() => setModalAbierto(true)}
          style={{ cursor: 'pointer', padding: '0.6rem 1.2rem', fontWeight: 'bold' }}
        >
          + Crear Nuevo Estudio
        </button>
      </section>

      {/* Modal interactivo de creación de estudio */}
      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Registrar Nuevo Estudio Clínico</h2>
            <form onSubmit={(e) => void handleCrearEstudio(e)} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem' }}>Código Interno *</label>
                <input type="text" required placeholder="Ej. EST-ONCO-999" value={formulario.codigo_interno} onChange={(e) => setFormulario({ ...formulario, codigo_interno: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem' }}>Título del Estudio *</label>
                <input type="text" required placeholder="Ej. Estudio Fase 3 en Cáncer..." value={formulario.titulo} onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem' }}>Patrocinador *</label>
                  <input type="text" required placeholder="Ej. Roche" value={formulario.patrocinador} onChange={(e) => setFormulario({ ...formulario, patrocinador: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem' }}>Fase *</label>
                  <select value={formulario.fase} onChange={(e) => setFormulario({ ...formulario, fase: e.target.value })} style={{ width: '100%', padding: '0.4rem' }}>
                    <option value="Fase 1">Fase 1</option>
                    <option value="Fase 1/2">Fase 1/2</option>
                    <option value="Fase 2">Fase 2</option>
                    <option value="Fase 3">Fase 3</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem' }}>Patología *</label>
                  <input type="text" required placeholder="Ej. Cáncer de Mama" value={formulario.patologia} onChange={(e) => setFormulario({ ...formulario, patologia: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem' }}>Escenario Clínico *</label>
                  <input type="text" required placeholder="Ej. Metastásico" value={formulario.escenario_clinico} onChange={(e) => setFormulario({ ...formulario, escenario_clinico: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem' }}>Estado Operacional</label>
                  <select value={formulario.estado_operacional} onChange={(e) => setFormulario({ ...formulario, estado_operacional: e.target.value })} style={{ width: '100%', padding: '0.4rem' }}>
                    <option value="activado">Activado</option>
                    <option value="cerrado_temporalmente">Cerrado Temporalmente</option>
                    <option value="cerrado_definitivo">Cerrado Definitivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem' }}>Disponibilidad</label>
                  <select value={formulario.disponibilidad} onChange={(e) => setFormulario({ ...formulario, disponibilidad: e.target.value })} style={{ width: '100%', padding: '0.4rem' }}>
                    <option value="con_cupo">Con Cupo</option>
                    <option value="sin_cupo">Sin Cupo</option>
                    <option value="lista_espera">Lista de Espera</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
                <button type="submit" disabled={guardando} className="boton-primario" style={{ padding: '0.5rem 1rem' }}>
                  {guardando ? 'Guardando...' : 'Crear Estudio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="rejilla-indicadores" aria-label="Indicadores de inventario">
        <article className="tarjeta-indicador">
          <p>Estudios en Inventario</p>
          <strong>{estudios.length}</strong>
          <small>{totalActivados} activados operativamente</small>
        </article>
        <article className="tarjeta-indicador">
          <p>Disponibilidad informada</p>
          <strong>{totalConCupo} con cupo</strong>
          <small>Disponibilidad independiente del estado</small>
        </article>
        <article className="tarjeta-indicador">
          <p>Pendientes confirmación</p>
          <strong>{totalSinConfirmar}</strong>
          <small>Revisión humana requerida</small>
        </article>
      </section>

      <section className="panel-tabla" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Patología</label>
            <input
              type="text"
              placeholder="Buscar por patología..."
              value={patologia}
              onChange={(e) => setPatologia(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Estado Operacional</label>
            <select
              value={estadoOperacional}
              onChange={(e) => setEstadoOperacional(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Todos</option>
              <option value="activado">Activado</option>
              <option value="cerrado_temporalmente">Cerrado Temporalmente</option>
              <option value="cerrado_definitivo">Cerrado Definitivo</option>
              <option value="suspendido">Suspendido</option>
              <option value="sin_confirmar">Sin Confirmar</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Disponibilidad</label>
            <select
              value={disponibilidad}
              onChange={(e) => setDisponibilidad(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Todas</option>
              <option value="con_cupo">Con Cupo</option>
              <option value="sin_cupo">Sin Cupo</option>
              <option value="lista_espera">Lista de Espera</option>
              <option value="slot_reservado">Slot Reservado</option>
              <option value="sin_confirmar">Sin Confirmar</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Vigencia Fuente</label>
            <select
              value={vigencia}
              onChange={(e) => setVigencia(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Todas</option>
              <option value="vigente">Vigente</option>
              <option value="por_revisar">Por Revisar</option>
              <option value="desactualizada">Desactualizada</option>
            </select>
          </div>
        </div>
      </section>

      <section className="panel-tabla">
        <div className="cabecera-tabla">
          <div>
            <p className="sobrelinea">Datos del backend API</p>
            <h2>Listado de Estudios</h2>
          </div>
          <span>{estudios.length} registros</span>
        </div>

        {cargando && <p style={{ padding: '1rem' }}>Cargando inventario de estudios desde la API...</p>}
        {error && (
          <div style={{ padding: '1rem', color: '#c53030' }}>
            <p>Error: {error}</p>
            <button
              type="button"
              onClick={() => {
                setCargando(true)
                setError(null)
                obtenerEstudios({
                  patologia: patologia || undefined,
                  estado_operacional: estadoOperacional || undefined,
                  disponibilidad: disponibilidad || undefined,
                  vigencia: vigencia || undefined,
                })
                  .then((datos) => {
                    setEstudios(datos)
                    setCargando(false)
                  })
                  .catch((err: unknown) => {
                    setError(err instanceof Error ? err.message : 'Error al cargar estudios.')
                    setCargando(false)
                  })
              }}
              style={{ marginTop: '0.5rem' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <div className="tabla-desplazable">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título / Patología</th>
                  <th>Fase / Escenario</th>
                  <th>Estado Operacional</th>
                  <th>Disponibilidad</th>
                  <th>Vigencia Fuente</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {estudios.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem' }}>
                      No se encontraron estudios que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  estudios.map((estudio) => (
                    <tr key={estudio.id}>
                      <td><strong>{estudio.codigo_interno}</strong></td>
                      <td>
                        <div><strong>{estudio.titulo}</strong></div>
                        <small style={{ color: '#666' }}>{estudio.patologia} · {estudio.linea_tratamiento}</small>
                      </td>
                      <td>{estudio.fase} · {estudio.escenario_clinico}</td>
                      <td>
                        <span className={`etiqueta-estado estado-${estudio.estado_operacional}`}>
                          {estudio.estado_operacional.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`etiqueta-disponibilidad disp-${estudio.disponibilidad}`}>
                          {estudio.disponibilidad.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`etiqueta-vigencia vig-${estudio.etiqueta_vigencia}`}>
                          {estudio.etiqueta_vigencia.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <Link to={`/estudios/${estudio.id}`} className="boton-enlace" style={{ padding: '0.4rem 0.8rem', background: '#0056b3', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem' }}>
                          Ver detalle &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
