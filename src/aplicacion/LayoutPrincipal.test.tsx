import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, vi } from 'vitest'

import { ProveedorSesion } from '../dominios/autenticacion/ContextoSesion'
import { almacenamientoSesion } from '../dominios/autenticacion/sesionContexto'
import { RutasAplicacion } from '../rutas/RutasAplicacion'

function renderizar(ruta = '/') {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ProveedorSesion>
        <MemoryRouter initialEntries={[ruta]}>
          <RutasAplicacion />
        </MemoryRouter>
      </ProveedorSesion>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  sessionStorage.setItem(almacenamientoSesion.clave, 'token-ficticio')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: '00000000-0000-0000-0000-000000000001',
          nombres: 'Ada',
          apellidos: 'Administradora',
          correo: 'admin@example.com',
          es_administrador_sistema: true,
          activo: true,
          ultimo_acceso: null,
          creado_en: '2026-07-17T12:00:00Z',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  )
})

afterEach(() => {
  sessionStorage.clear()
  vi.unstubAllGlobals()
})

describe('Layout principal', () => {
  it('muestra navegación horizontal con los módulos planificados', async () => {
    renderizar()

    const navegacion = await screen.findByRole('navigation', { name: 'Navegación principal' })
    expect(navegacion).toBeVisible()
    expect(screen.getByRole('link', { name: 'Estudios' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Pacientes' })).toBeVisible()
    expect(screen.getByText('Datos de demostración')).toBeVisible()
  })

  it('presenta una ruta inexistente en español', async () => {
    renderizar('/ruta-inexistente')

    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeVisible()
  })
})
