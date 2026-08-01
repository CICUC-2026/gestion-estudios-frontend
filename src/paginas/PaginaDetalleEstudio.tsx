import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cambiarDisponibilidad, cambiarEstadoOperacional, obtenerEstudio, reconfirmarVigencia } from '../dominios/estudios/apiEstudios'
import type { Estudio } from '../dominios/estudios/tipos'

export function PaginaDetalleEstudio() {
  const { id } = useParams<{ id: string }>()
  const [estudio, setEstudio] = useState<Estudio | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pestana, setPestana] = useState<'resumen' | 'cohortes' | 'versiones' | 'historial'>('resumen')

  // Form estado operacional
  const [nuevoEstadoOp, setNuevoEstadoOp] = useState('')
  const [fuenteOp, setFuenteOp] = useState('')
  const [motivoOp, setMotivoOp] = useState('')

  // Form disponibilidad
  const [nuevaDisp, setNuevaDisp] = useState('')
  const [fuenteDisp, setFuenteDisp] = useState('')
  const [motivoDisp, setMotivoDisp] = useState('')

  useEffect(() => {
    if (!id) return
    let activo = true

    obtenerEstudio(id)
      .then((datos) => {
        if (activo) {
          setEstudio(datos)
          setCargando(false)
        }
      })
      .catch((err: unknown) => {
        if (activo) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar el estudio.')
          setCargando(false)
        }
      })

    return () => {
      activo = false
    }
  }, [id])

  async function handleCambiarEstadoOp(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !nuevoEstadoOp || !fuenteOp || !motivoOp) return
    try {
      await cambiarEstadoOperacional(id, {
        estado_operacional: nuevoEstadoOp,
        fuente: fuenteOp,
        motivo: motivoOp,
      })
      setNuevoEstadoOp('')
      setFuenteOp('')
      setMotivoOp('')
      const datos = await obtenerEstudio(id)
      setEstudio(datos)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar estado operacional')
    }
  }

  async function handleCambiarDisp(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !nuevaDisp || !fuenteDisp || !motivoDisp) return
    try {
      await cambiarDisponibilidad(id, {
        disponibilidad: nuevaDisp,
        fuente: fuenteDisp,
        motivo: motivoDisp,
      })
      setNuevaDisp('')
      setFuenteDisp('')
      setMotivoDisp('')
      const datos = await obtenerEstudio(id)
      setEstudio(datos)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar disponibilidad')
    }
  }

  async function handleReconfirmarVigencia() {
    if (!id) return
    const fuente = prompt('Ingrese la fuente o documento de verificación:')
    if (!fuente) return
    try {
      await reconfirmarVigencia(id, { fuente_informacion: fuente })
      const datos = await obtenerEstudio(id)
      setEstudio(datos)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al reconfirmar vigencia')
    }
  }

  if (cargando) return <p style={{ padding: '2rem' }}>Cargando ficha estructurada del estudio...</p>
  if (error || !estudio) return <p style={{ padding: '2rem', color: '#c53030' }}>Error: {error || 'Estudio no encontrado'}</p>

  return (
    <div className="pagina-detalle-estudio">
      <section className="encabezado-pagina">
        <div>
          <Link to="/estudios" className="boton-enlace" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            &larr; Volver al inventario
          </Link>
          <p className="sobrelinea">{estudio.patrocinador} · {estudio.fase}</p>
          <h1>{estudio.codigo_interno}: {estudio.titulo}</h1>
          <p>{estudio.patologia} — {estudio.escenario_clinico} ({estudio.linea_tratamiento})</p>
        </div>
      </section>

      {/* Cabecera con etiquetas independientes (HU-030 y HU-032) */}
      <section className="panel-tabla resumen-estados">
        <div className="rejilla-estados">
          <div>
            <small style={{ display: 'block', color: '#666' }}>Estado Operacional</small>
            <strong style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>
              {estudio.estado_operacional.replace('_', ' ')}
            </strong>
          </div>
          <div>
            <small style={{ display: 'block', color: '#666' }}>Disponibilidad Informada</small>
            <strong style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>
              {estudio.disponibilidad.replace('_', ' ')}
            </strong>
          </div>
          <div>
            <small style={{ display: 'block', color: '#666' }}>Vigencia de Fuente</small>
            <strong style={{ fontSize: '1.1rem', textTransform: 'capitalize', color: estudio.etiqueta_vigencia === 'vigente' ? 'green' : 'orange' }}>
              {estudio.etiqueta_vigencia.replace('_', ' ')}
            </strong>
          </div>
          <button type="button" onClick={() => void handleReconfirmarVigencia()} className="boton-primario accion-vigencia">
            Reconfirmar vigencia
          </button>
        </div>
      </section>

      {/* Pestañas de Navegación del Detalle (HU-034) */}
      <div className="pestanas-detalle" role="tablist" aria-label="Secciones del estudio">
        <button
          type="button"
          role="tab"
          aria-selected={pestana === 'resumen'}
          className={pestana === 'resumen' ? 'pestana activa' : 'pestana'}
          onClick={() => setPestana('resumen')}
        >
          Resumen General
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestana === 'cohortes'}
          className={pestana === 'cohortes' ? 'pestana activa' : 'pestana'}
          onClick={() => setPestana('cohortes')}
        >
          Cohortes y Brazos ({estudio.cohortes.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestana === 'versiones'}
          className={pestana === 'versiones' ? 'pestana activa' : 'pestana'}
          onClick={() => setPestana('versiones')}
        >
          Versiones e Inmutabilidad
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pestana === 'historial'}
          className={pestana === 'historial' ? 'pestana activa' : 'pestana'}
          onClick={() => setPestana('historial')}
        >
          Historial de Cambios de Estado ({estudio.historial_estados.length})
        </button>
      </div>

      {/* Contenido según pestaña */}
      {pestana === 'resumen' && (
        <section className="panel-tabla" style={{ padding: '1.5rem' }}>
          <h3>Ficha de Información General</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div><strong>Centro de Atención:</strong> <p>{estudio.centro_atencion}</p></div>
            <div><strong>Fuente Registrada:</strong> <p>{estudio.fuente_informacion || 'Pendiente'}</p></div>
            <div><strong>Fecha Verificación:</strong> <p>{estudio.fecha_verificacion ? new Date(estudio.fecha_verificacion).toLocaleDateString() : 'Por revisar'}</p></div>
            <div><strong>Próxima Revisión:</strong> <p>{estudio.proxima_revision ? new Date(estudio.proxima_revision).toLocaleDateString() : 'Pendiente'}</p></div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <strong>Observaciones operacionales:</strong>
            <p style={{ marginTop: '0.5rem', background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
              {estudio.observaciones || 'Sin observaciones registradas.'}
            </p>
          </div>
        </section>
      )}

      {pestana === 'cohortes' && (
        <section className="panel-tabla" style={{ padding: '1.5rem' }}>
          <h3>Poblaciones, Cohortes y Brazos del Estudio</h3>
          {estudio.cohortes.length === 0 ? (
            <p style={{ marginTop: '1rem' }}>No se han definido cohortes específicas para este estudio.</p>
          ) : (
            estudio.cohortes.map((cohorte) => (
              <div key={cohorte.id} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '1rem', marginTop: '1rem' }}>
                <h4>{cohorte.nombre}</h4>
                <p><small>{cohorte.patologia || estudio.patologia} · Subtipo: {cohorte.subtipo_histologico || 'General'}</small></p>
                <p style={{ marginTop: '0.5rem' }}>{cohorte.descripcion || 'Sin descripción adicional.'}</p>

                <h5 style={{ marginTop: '1rem' }}>Brazos de Tratamiento ({cohorte.brazos.length}):</h5>
                {cohorte.brazos.length === 0 ? (
                  <p><small>No hay brazos agregados a esta cohorte.</small></p>
                ) : (
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                    {cohorte.brazos.map((brazo) => (
                      <li key={brazo.id}>
                        <strong>{brazo.nombre}:</strong> {brazo.descripcion || 'Sin descripción'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>
      )}

      {pestana === 'versiones' && (
        <section className="panel-tabla" style={{ padding: '1.5rem' }}>
          <h3>Versiones del Protocolo Oficial</h3>
          {estudio.version_vigente ? (
            <div style={{ background: '#e6fffa', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <span style={{ color: 'green', fontWeight: 'bold' }}>VERSION VIGENTE ACTUAL:</span> {estudio.version_vigente.numero_version}
              <p style={{ marginTop: '0.5rem' }}>{estudio.version_vigente.descripcion_cambios}</p>
              <small>Publicada el: {new Date(estudio.version_vigente.publicada_en!).toLocaleString()}</small>
            </div>
          ) : (
            <p style={{ color: 'orange', marginBottom: '1rem' }}>Aún no hay una versión de protocolo publicada como vigente.</p>
          )}
        </section>
      )}

      {pestana === 'historial' && (
        <section className="panel-tabla" style={{ padding: '1.5rem' }}>
          <h3>Historial de Cambios de Estado y Disponibilidad (Auditoría HU-030)</h3>

          <div className="rejilla-formularios-estado">
            <form className="formulario-estado" onSubmit={(e) => void handleCambiarEstadoOp(e)}>
              <h4>Cambiar Estado Operacional</h4>
              <select value={nuevoEstadoOp} onChange={(e) => setNuevoEstadoOp(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.5rem' }} required>
                <option value="">Seleccione estado...</option>
                <option value="activado">Activado</option>
                <option value="cerrado_temporalmente">Cerrado Temporalmente</option>
                <option value="cerrado_definitivo">Cerrado Definitivo</option>
                <option value="suspendido">Suspendido</option>
              </select>
              <input type="text" placeholder="Fuente autorizada (ej. Patrocinador)" value={fuenteOp} onChange={(e) => setFuenteOp(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.5rem' }} required />
              <textarea placeholder="Motivo de cambio..." value={motivoOp} onChange={(e) => setMotivoOp(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.5rem' }} required />
              <button type="submit" className="boton-primario" style={{ marginTop: '0.5rem' }}>Guardar Estado Operacional</button>
            </form>

            <form className="formulario-estado" onSubmit={(e) => void handleCambiarDisp(e)}>
              <h4>Cambiar Disponibilidad</h4>
              <select value={nuevaDisp} onChange={(e) => setNuevaDisp(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.5rem' }} required>
                <option value="">Seleccione disponibilidad...</option>
                <option value="con_cupo">Con Cupo</option>
                <option value="sin_cupo">Sin Cupo</option>
                <option value="lista_espera">Lista de Espera</option>
                <option value="slot_reservado">Slot Reservado</option>
              </select>
              <input type="text" placeholder="Fuente autorizada" value={fuenteDisp} onChange={(e) => setFuenteDisp(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.5rem' }} required />
              <textarea placeholder="Motivo de cambio..." value={motivoDisp} onChange={(e) => setMotivoDisp(e.target.value)} style={{ width: '100%', padding: '0.4rem', marginTop: '0.5rem' }} required />
              <button type="submit" className="boton-primario" style={{ marginTop: '0.5rem' }}>Guardar Disponibilidad</button>
            </form>
          </div>

          <div className="tabla-desplazable"><table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Campo</th>
                <th>Anterior</th>
                <th>Nuevo</th>
                <th>Fuente</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {estudio.historial_estados.map((h) => (
                <tr key={h.id}>
                  <td data-label="Fecha">{new Date(h.fecha).toLocaleString()}</td>
                  <td data-label="Campo"><strong>{h.campo_modificado}</strong></td>
                  <td data-label="Anterior">{h.valor_anterior || 'Sin valor'}</td>
                  <td data-label="Nuevo"><strong>{h.valor_nuevo}</strong></td>
                  <td data-label="Fuente">{h.fuente}</td>
                  <td data-label="Motivo">{h.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>
      )}
    </div>
  )
}
