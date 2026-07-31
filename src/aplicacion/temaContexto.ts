import { createContext, useContext } from 'react'

export type TipoTema = 'estandar' | 'alto-contraste' | 'daltonismo'

export interface ContextoTemaValor {
  tema: TipoTema
  cambiarTema: (nuevoTema: TipoTema) => void
}

export const CLAVE_ALMACENAMIENTO_TEMA = 'cicuc_tema'

export const ContextoTema = createContext<ContextoTemaValor | undefined>(undefined)

export function useTema(): ContextoTemaValor {
  const contexto = useContext(ContextoTema)
  if (!contexto) {
    throw new Error('useTema debe usarse dentro de un ProveedorTema')
  }
  return contexto
}
