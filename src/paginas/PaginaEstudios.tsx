import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerEstudios } from '../dominios/estudios/apiEstudios'
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

  async function cargar() {
    setCargando(true)
    setError(null)
    try {
      const datos = await obtenerEstudios({
        patologia: patologia || undefined,
        estado_operacional: estadoOperacional || undefined,
        disponibilidad: disponibilidad || undefined,
        vigencia: vigencia || undefined,
      })
      setEstudios(datos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estudios.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    void cargar()
  }, [patologia, estadoOperacional, disponibilidad, vigencia])

  const totalActivados = estudios.filter((e) => e.estado_operacional === 'activado').length
  const totalConCupo = estudios.filter((e) => e.disponibilidad === 'con_cupo').length
  const totalSinConfirmar = estudios.filter((e) => e.estado_operacional === 'sin_confirmar').length

  return (
    <>
      <section className="encabezado-pagina">
        <div>
          <p className="sobrelinea">Inventario de Ensayos Oncológicos</p>
          <h1>Estudios Clínicos</h1>
          <p>Catálogo unificado con separación de estado operacional, disponibilidad y fuente de vigencia.</p>
        </div>
      </section>

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
            <button type="button" onClick={() => void cargar()} style={{ marginTop: '0.5rem' }}>
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
                        <Link to={`/estudios/${estudio.id}`} className="boton-enlace">
                          Ver detalle
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
