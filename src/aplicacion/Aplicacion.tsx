import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import { RutasAplicacion } from '../rutas/RutasAplicacion'
import { ProveedorSesion } from '../dominios/autenticacion/ContextoSesion'

const clienteConsultas = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export function Aplicacion() {
  return (
    <QueryClientProvider client={clienteConsultas}>
      <ProveedorSesion>
        <BrowserRouter>
          <RutasAplicacion />
        </BrowserRouter>
      </ProveedorSesion>
    </QueryClientProvider>
  )
}
