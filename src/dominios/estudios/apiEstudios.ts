import { CLAVE_TOKEN } from '../autenticacion/sesionContexto'
import { solicitarApi } from '../../servicios/clienteApi'
import type {
  ComparacionVersiones,
  Estudio,
  VersionProtocolo,
} from './tipos'

export async function obtenerEstudios(): Promise<Estudio[]> {
  const token = sessionStorage.getItem(CLAVE_TOKEN)
  return solicitarApi<Estudio[]>('/estudios', {}, token)
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
