import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { RutasAplicacion } from '../rutas/RutasAplicacion'

function renderizar(ruta = '/') {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[ruta]}>
        <RutasAplicacion />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Layout principal', () => {
  it('muestra navegación horizontal con los módulos planificados', () => {
    renderizar()

    const navegacion = screen.getByRole('navigation', { name: 'Navegación principal' })
    expect(navegacion).toBeVisible()
    expect(screen.getByRole('link', { name: 'Estudios' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Pacientes' })).toBeVisible()
    expect(screen.getByText('Datos de demostración')).toBeVisible()
  })

  it('presenta una ruta inexistente en español', () => {
    renderizar('/ruta-inexistente')

    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeVisible()
  })
})
