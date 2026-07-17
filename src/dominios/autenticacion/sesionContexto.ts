import { createContext, useContext } from 'react'

import type { UsuarioSesion } from './tipos'

export const CLAVE_TOKEN = 'cicuc.tokenSesion'

export type ValorContextoSesion = {
  usuario: UsuarioSesion | null
  cargando: boolean
  ingresar: (correo: string, contrasena: string) => Promise<void>
  salir: () => Promise<void>
}

export const ContextoSesion = createContext<ValorContextoSesion | null>(null)

export function useSesion(): ValorContextoSesion {
  const contexto = useContext(ContextoSesion)
  if (!contexto) {
    throw new Error('useSesion debe utilizarse dentro de ProveedorSesion')
  }
  return contexto
}

export const almacenamientoSesion = {
  clave: CLAVE_TOKEN,
}
