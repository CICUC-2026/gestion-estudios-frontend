import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, vi } from 'vitest'

import { ProveedorTema } from './ContextoTema'
import { ProveedorSesion } from '../dominios/autenticacion/ContextoSesion'
import { almacenamientoSesion } from '../dominios/autenticacion/sesionContexto'
import { RutasAplicacion } from '../rutas/RutasAplicacion'

function renderizar(ruta = '/') {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ProveedorTema>
        <ProveedorSesion>
          <MemoryRouter initialEntries={[ruta]}>
            <RutasAplicacion />
          </MemoryRouter>
        </ProveedorSesion>
      </ProveedorTema>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  sessionStorage.setItem(almacenamientoSesion.clave, 'token-ficticio')
  localStorage.clear()
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
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('Layout principal', () => {
  it('muestra la navegación principal con los módulos planificados', async () => {
    renderizar()

    const navegaciones = await screen.findAllByRole('navigation', { name: 'Navegación principal' })
    const navegacion = navegaciones[0]
    if (!navegacion) throw new Error('No se encontró la navegación principal')
    expect(navegacion).toBeVisible()
    expect(within(navegacion).getByRole('link', { name: 'Estudios' })).toBeVisible()
    expect(within(navegacion).getByRole('link', { name: 'Pacientes' })).toBeVisible()
    expect(screen.getByText('Datos de demostración')).toBeVisible()
  })

  it('presenta una ruta inexistente en español', async () => {
    renderizar('/ruta-inexistente')

    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeVisible()
  })

  it('permite cambiar el tema visual y persiste la selección en localStorage', async () => {
    renderizar()

    const selectorTema = await screen.findByRole('combobox', { name: 'Seleccionar tema visual' })
    expect(selectorTema).toBeInTheDocument()

    // Cambiar a tema adaptado para daltonismo
    fireEvent.change(selectorTema, { target: { value: 'daltonismo' } })
    expect(document.documentElement.getAttribute('data-tema')).toBe('daltonismo')
    expect(localStorage.getItem('cicuc_tema')).toBe('daltonismo')

    // Cambiar a alto contraste
    fireEvent.change(selectorTema, { target: { value: 'alto-contraste' } })
    expect(document.documentElement.getAttribute('data-tema')).toBe('alto-contraste')
    expect(localStorage.getItem('cicuc_tema')).toBe('alto-contraste')
  })
})

