import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, vi } from 'vitest'

import { RutasAplicacion } from '../../rutas/RutasAplicacion'
import { ProveedorTema } from '../../aplicacion/ContextoTema'
import { ProveedorSesion } from './ContextoSesion'

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


afterEach(() => {
  sessionStorage.clear()
  vi.unstubAllGlobals()
})

describe('Autenticación', () => {
  it('redirige rutas protegidas al ingreso', async () => {
    renderizar('/pacientes')

    expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Pacientes' })).not.toBeInTheDocument()
  })

  it('inicia sesión y recupera la ruta solicitada', async () => {
    const fetchSimulado = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            token_acceso: 'token-ficticio',
            tipo: 'bearer',
            expira_en: '2026-07-17T20:00:00Z',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )
      .mockResolvedValueOnce(
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
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    vi.stubGlobal('fetch', fetchSimulado)
    const usuario = userEvent.setup()
    renderizar('/pacientes')

    await usuario.type(await screen.findByLabelText('Correo institucional'), 'admin@example.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'Contrasena-Demo-2026')
    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('heading', { name: 'Pacientes' })).toBeVisible()
    expect(fetchSimulado).toHaveBeenCalledTimes(4)
  })

  it('muestra un error genérico sin revelar estado de cuenta', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              codigo: 'CREDENCIALES_INVALIDAS',
              mensaje: 'Las credenciales no son válidas.',
            },
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    )
    const usuario = userEvent.setup()
    renderizar('/ingresar')

    await usuario.type(await screen.findByLabelText('Correo institucional'), 'nadie@example.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await usuario.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Las credenciales no son válidas.')
  })
})
