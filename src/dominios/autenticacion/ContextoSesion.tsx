import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ErrorApi, solicitarApi } from '../../servicios/clienteApi'
import { CLAVE_TOKEN, ContextoSesion } from './sesionContexto'
import type { TokenSesion, UsuarioSesion } from './tipos'

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null)
  const [cargando, setCargando] = useState(false)

  const limpiar = useCallback(() => {
    sessionStorage.removeItem(CLAVE_TOKEN)
    setUsuario(null)
  }, [])

  const cargarUsuario = useCallback(async (token: string) => {
    const actual = await solicitarApi<UsuarioSesion>('/autenticacion/yo', {}, token)
    setUsuario(actual)
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem(CLAVE_TOKEN)
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void cargarUsuario(token)
        .catch(() => limpiar())
        .finally(() => setCargando(false))
    }
  }, [cargarUsuario, limpiar])

  const ingresar = useCallback(
    async (correo: string, contrasena: string) => {
      const sesion = await solicitarApi<TokenSesion>('/autenticacion/ingresar', {
        method: 'POST',
        body: JSON.stringify({ correo, contrasena }),
      })
      sessionStorage.setItem(CLAVE_TOKEN, sesion.token_acceso)
      try {
        await cargarUsuario(sesion.token_acceso)
      } catch (error) {
        limpiar()
        throw error
      }
    },
    [cargarUsuario, limpiar],
  )

  const salir = useCallback(async () => {
    const token = sessionStorage.getItem(CLAVE_TOKEN)
    try {
      if (token) {
        await solicitarApi<void>('/autenticacion/salir', { method: 'POST' }, token)
      }
    } catch (error) {
      if (!(error instanceof ErrorApi) || error.estado >= 500) {
        throw error
      }
    } finally {
      limpiar()
    }
  }, [limpiar])

  const valor = useMemo(
    () => ({ usuario, cargando, ingresar, salir }),
    [usuario, cargando, ingresar, salir],
  )
  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>
}
