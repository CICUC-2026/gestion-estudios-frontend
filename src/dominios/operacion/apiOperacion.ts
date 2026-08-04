import { solicitarApi } from '../../servicios/clienteApi'
import { CLAVE_TOKEN } from '../autenticacion/sesionContexto'

export type Tarea = { id: string; titulo: string; prioridad: string; estado: string; vence_en: string | null; paciente_id: string | null; estudio_id: string | null }
export type MetricaReporte = { valor: number | null; presentacion: string; estado: string; suprimido: boolean; nota?: string }
export type Reporte = { id: string; nombre: string; finalidad: string; fecha_corte: string; contenido: { estudios: number; tareas_pendientes: number; definicion?: string; filtros?: { estudio_id: string | null; estados_tarea: string[] }; politica_supresion?: string; metricas?: Record<string, MetricaReporte>; advertencia?: string }; creado_en: string }
const token = () => sessionStorage.getItem(CLAVE_TOKEN)
export const obtenerTareas = () => solicitarApi<Tarea[]>('/tareas', {}, token())
export const crearTarea = (datos: { titulo: string; descripcion?: string; prioridad: string; vence_en?: string; paciente_id?: string; estudio_id?: string }) => solicitarApi<Tarea>('/tareas', { method: 'POST', body: JSON.stringify(datos) }, token())
export const actualizarTarea = (id: string, datos: { estado?: string; prioridad?: string; titulo?: string }) => solicitarApi<Tarea>(`/tareas/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }, token())
export const obtenerReportes = () => solicitarApi<Reporte[]>('/reportes', {}, token())
export const prepararReporte = (datos: { fecha_corte?: string; estudio_id?: string; estados_tarea?: string[] }) => solicitarApi<Reporte>('/reportes', { method: 'POST', body: JSON.stringify({ nombre: 'Resumen operativo', finalidad: 'Seguimiento administrativo de estudios, cupos, preselecciones y tareas', ...datos }) }, token())
