import { useEffect, useState, type ReactNode } from 'react'

import {
  CLAVE_ALMACENAMIENTO_TEMA,
  ContextoTema,
  type TipoTema,
} from './temaContexto'

export function ProveedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<TipoTema>(() => {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO_TEMA) as TipoTema | null
    if (guardado && ['estandar', 'alto-contraste', 'daltonismo'].includes(guardado)) {
      return guardado
    }
    return 'estandar'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    localStorage.setItem(CLAVE_ALMACENAMIENTO_TEMA, tema)
  }, [tema])

  const cambiarTema = (nuevoTema: TipoTema) => {
    setTema(nuevoTema)
  }

  return (
    <ContextoTema.Provider value={{ tema, cambiarTema }}>
      {children}
    </ContextoTema.Provider>
  )
}
