export type EstadoOperacionalEstudio =
  | 'activado'
  | 'cerrado_temporalmente'
  | 'cerrado_definitivo'
  | 'suspendido'
  | 'sin_confirmar'

export type EstadoDisponibilidadEstudio =
  | 'con_cupo'
  | 'sin_cupo'
  | 'lista_espera'
  | 'slot_reservado'
  | 'sin_confirmar'

export type EtiquetaVigencia = 'vigente' | 'por_revisar' | 'desactualizada'

export type AlcanceCriterio = 'estudio' | 'cohorte' | 'brazo'

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

export type Brazo = {
  id: string
  cohorte_id: string
  nombre: string
  descripcion: string | null
}

export type Cohorte = {
  id: string
  estudio_id: string
  nombre: string
  descripcion: string | null
  patologia: string | null
  subtipo_histologico: string | null
  escenario_clinico: string | null
  linea_tratamiento: string | null
  biomarcadores_requeridos: string[]
  meta_reclutamiento: number | null
  estado_operacional: EstadoOperacionalEstudio | null
  disponibilidad: EstadoDisponibilidadEstudio | null
  brazos: Brazo[]
}

export type CriterioManual = {
  id: string
  version_id: string
  tipo: TipoCriterio
  alcance: AlcanceCriterio
  cohorte_id: string | null
  brazo_id: string | null
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

export type HistorialEstado = {
  id: string
  estudio_id: string
  campo_modificado: string
  valor_anterior: string | null
  valor_nuevo: string
  fecha: string
  autor_id: string | null
  fuente: string | null
  motivo: string | null
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
  estado_operacional: EstadoOperacionalEstudio
  disponibilidad: EstadoDisponibilidadEstudio
  estado: EstadoEstudio
  disponible: boolean
  fuente_informacion: string | null
  fecha_corte: string | null
  verificado_por_id: string | null
  fecha_verificacion: string | null
  proxima_revision: string | null
  etiqueta_vigencia: EtiquetaVigencia
  observaciones: string | null
  creado_en: string
  actualizado_en: string
  cohortes: Cohorte[]
  version_vigente: VersionProtocolo | null
  historial_estados: HistorialEstado[]
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
