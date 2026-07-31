export type EstadoEstudio =
  | 'borrador'
  | 'en_revision'
  | 'vigente'
  | 'suspendido'
  | 'cerrado'
  | 'archivado'

export type EstadoVersionProtocolo =
  | 'borrador'
  | 'en_revision'
  | 'vigente'
  | 'reemplazada'
  | 'archivada'

export type TipoCriterio = 'inclusion' | 'exclusion'

export type Cohorte = {
  id: string
  estudio_id: string
  nombre: string
  descripcion: string | null
  biomarcadores_requeridos: string[]
  meta_reclutamiento: number | null
}

export type CriterioManual = {
  id: string
  version_id: string
  tipo: TipoCriterio
  orden: number
  codigo_criterio: string
  descripcion: string
  seccion_fuente: string | null
  observaciones: string | null
}

export type VersionProtocolo = {
  id: string
  estudio_id: string
  numero_version: string
  descripcion_cambios: string
  estado: EstadoVersionProtocolo
  es_vigente: boolean
  creada_en: string
  publicada_en: string | null
  criterios: CriterioManual[]
}

export type Estudio = {
  id: string
  codigo_interno: string
  titulo: string
  patrocinador: string
  fase: string
  patologia: string
  escenario_clinico: string
  linea_tratamiento: string
  centro_atencion: string
  estado: EstadoEstudio
  disponible: boolean
  observaciones: string | null
  creado_en: string
  actualizado_en: string
  cohortes: Cohorte[]
  version_vigente: VersionProtocolo | null
}

export type ComparacionVersiones = {
  estudio_id: string
  version_anterior: VersionProtocolo
  version_nueva: VersionProtocolo
  criterios_agregados: CriterioManual[]
  criterios_eliminados: CriterioManual[]
  criterios_modificados: Array<{
    anterior: CriterioManual
    nuevo: CriterioManual
  }>
}
