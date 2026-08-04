import { CLAVE_TOKEN } from '../autenticacion/sesionContexto'
import { solicitarApi } from '../../servicios/clienteApi'

export type EstadoPacienteDemo = 'antecedentes_pendientes' | 'revision_administrativa' | 'informacion_incompleta' | 'seguimiento_cerrado'
export type PacienteDemo = { id: string; codigo: string; rango_etario: string; patologia: string; estado: EstadoPacienteDemo; sintetico: boolean; archivado: boolean; creado_en: string; actualizado_en: string }
export type DiagnosticoDemo = { id: string; paciente_id: string; diagnostico: string; biomarcador: string | null; resultado_biomarcador: string | null; fecha: string; fuente: string }
export type AsociacionEstudioDemo = { id: string; paciente_id: string; estudio_id: string; estado: string; observaciones: string | null }
const token = () => sessionStorage.getItem(CLAVE_TOKEN)

export const obtenerPacientesDemo = () => solicitarApi<PacienteDemo[]>('/pacientes-demo', {}, token())
export const crearPacienteDemo = (datos: { codigo: string; rango_etario: string; patologia: string; estado: EstadoPacienteDemo }) => solicitarApi<PacienteDemo>('/pacientes-demo', { method: 'POST', body: JSON.stringify(datos) }, token())
export const actualizarPacienteDemo = (id: string, datos: Partial<Pick<PacienteDemo, 'rango_etario' | 'patologia' | 'estado' | 'archivado'>>) => solicitarApi<PacienteDemo>(`/pacientes-demo/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }, token())
export const crearDiagnosticoDemo = (id: string, datos: { diagnostico: string; biomarcador?: string; resultado_biomarcador?: string; fecha: string; fuente: string }) => solicitarApi<DiagnosticoDemo>(`/pacientes-demo/${id}/diagnosticos`, { method: 'POST', body: JSON.stringify(datos) }, token())
export const asociarEstudioDemo = (id: string, estudio_id: string) => solicitarApi<AsociacionEstudioDemo>(`/pacientes-demo/${id}/estudios`, { method: 'POST', body: JSON.stringify({ estudio_id, observaciones: 'Asociación administrativa de demostración' }) }, token())
