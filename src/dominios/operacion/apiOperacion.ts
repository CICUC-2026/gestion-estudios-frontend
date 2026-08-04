import { solicitarApi } from '../../servicios/clienteApi'
import { CLAVE_TOKEN } from '../autenticacion/sesionContexto'

export type Tarea = { id: string; titulo: string; prioridad: string; estado: string; vence_en: string | null; paciente_id: string | null; estudio_id: string | null }
export type Reporte = { id: string; nombre: string; fecha_corte: string; contenido: Record<string, number>; creado_en: string }
const token = () => sessionStorage.getItem(CLAVE_TOKEN)
export const obtenerTareas = () => solicitarApi<Tarea[]>('/tareas', {}, token())
export const crearTarea = (datos: { titulo: string; prioridad: string; vence_en?: string; paciente_id?: string; estudio_id?: string }) => solicitarApi<Tarea>('/tareas', { method: 'POST', body: JSON.stringify(datos) }, token())
export const actualizarTarea = (id: string, datos: { estado?: string; prioridad?: string; titulo?: string }) => solicitarApi<Tarea>(`/tareas/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }, token())
export const obtenerReportes = () => solicitarApi<Reporte[]>('/reportes', {}, token())
export const prepararReporte = () => solicitarApi<Reporte>('/reportes', { method: 'POST', body: JSON.stringify({ nombre: 'Resumen operativo', finalidad: 'Seguimiento administrativo de estudios y tareas pendientes' }) }, token())
