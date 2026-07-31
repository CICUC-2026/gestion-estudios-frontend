import { CLAVE_TOKEN } from '../autenticacion/sesionContexto'
import { solicitarApi } from '../../servicios/clienteApi'
import type {
  ComparacionVersiones,
  Estudio,
  VersionProtocolo,
} from './tipos'

export async function obtenerEstudios(filtros?: {
  patologia?: string
  estado?: string
  estado_operacional?: string
  disponibilidad?: string
  vigencia?: string
}): Promise<Estudio[]> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  const params = new URLSearchParams()
  if (filtros?.patologia) params.append('patologia', filtros.patologia)
  if (filtros?.estado) params.append('estado', filtros.estado)
  if (filtros?.estado_operacional) params.append('estado_operacional', filtros.estado_operacional)
  if (filtros?.disponibilidad) params.append('disponibilidad', filtros.disponibilidad)
  if (filtros?.vigencia) params.append('vigencia', filtros.vigencia)

  const query = params.toString() ? `?${params.toString()}` : ''
  return solicitarApi<Estudio[]>(`/estudios${query}`, {}, token)
}

export async function obtenerEstudio(id: string): Promise<Estudio> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<Estudio>(`/estudios/${id}`, {}, token)
}

export async function crearEstudio(datos: {
  codigo_interno: string
  titulo: string
  patrocinador: string
  fase: string
  patologia: string
  escenario_clinico: string
  linea_tratamiento: string
  centro_atencion?: string
  estado_operacional?: string
  disponibilidad?: string
  fuente_informacion?: string
  observaciones?: string
}): Promise<Estudio> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<Estudio>(
    '/estudios',
    {
      method: 'POST',
      body: JSON.stringify(datos),
    },
    token,
  )
}

export async function cambiarEstadoOperacional(
  estudioId: string,
  datos: { estado_operacional: string; fuente: string; motivo: string },
): Promise<Estudio> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<Estudio>(
    `/estudios/${estudioId}/estado-operacional`,
    {
      method: 'PATCH',
      body: JSON.stringify(datos),
    },
    token,
  )
}

export async function cambiarDisponibilidad(
  estudioId: string,
  datos: { disponibilidad: string; fuente: string; motivo: string },
): Promise<Estudio> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<Estudio>(
    `/estudios/${estudioId}/disponibilidad`,
    {
      method: 'PATCH',
      body: JSON.stringify(datos),
    },
    token,
  )
}

export async function reconfirmarVigencia(
  estudioId: string,
  datos: { fuente_informacion: string; dias_validez?: number },
): Promise<Estudio> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<Estudio>(
    `/estudios/${estudioId}/reconfirmar-vigencia`,
    {
      method: 'POST',
      body: JSON.stringify(datos),
    },
    token,
  )
}

export async function crearVersionProtocolo(
  estudioId: string,
  datos: {
    numero_version: string
    descripcion_cambios: string
    criterios: Array<{
      tipo: 'inclusion' | 'exclusion'
      codigo_criterio: string
      descripcion: string
      orden?: number
      seccion_fuente?: string
    }>
  },
): Promise<VersionProtocolo> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<VersionProtocolo>(
    `/estudios/${estudioId}/versiones`,
    {
      method: 'POST',
      body: JSON.stringify(datos),
    },
    token,
  )
}

export async function publicarVersionProtocolo(
  estudioId: string,
  versionId: string,
): Promise<VersionProtocolo> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<VersionProtocolo>(
    `/estudios/${estudioId}/versiones/${versionId}/publicar`,
    {
      method: 'POST',
    },
    token,
  )
}

export async function compararVersiones(
  estudioId: string,
  version1Id: string,
  version2Id: string,
): Promise<ComparacionVersiones> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<ComparacionVersiones>(
    `/estudios/${estudioId}/comparar-versiones?version_v1_id=${version1Id}&version_v2_id=${version2Id}`,
    {},
    token,
  )
}
