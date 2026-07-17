export type UsuarioSesion = {
  id: string
  nombres: string
  apellidos: string
  correo: string
  es_administrador_sistema: boolean
  activo: boolean
  ultimo_acceso: string | null
  creado_en: string
}

export type TokenSesion = {
  token_acceso: string
  tipo: 'bearer'
  expira_en: string
}
