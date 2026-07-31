import { expect, test } from '@playwright/test'

const usuario = {
  id: '00000000-0000-0000-0000-000000000001',
  nombres: 'Ada',
  apellidos: 'Administradora',
  correo: 'admin@example.com',
  es_administrador_sistema: true,
  activo: true,
  ultimo_acceso: null,
  creado_en: '2026-07-17T12:00:00Z',
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/estudios**', async (ruta) => {
    await ruta.fulfill({ json: [] })
  })
  await page.route('**/api/v1/autenticacion/yo', async (ruta) => {
    await ruta.fulfill({ json: usuario })
  })
  await page.addInitScript(() => {
    window.sessionStorage.setItem('cicuc.tokenSesion', 'token-ficticio')
  })
})

test('navega mediante la barra superior y conserva idioma español', async ({ page }) => {
  await page.goto('/')

  const navegacion = page.getByRole('navigation', { name: 'Navegación principal' })
  await expect(navegacion).toBeVisible()
  await page.getByRole('link', { name: 'Estudios' }).click()
  await expect(page).toHaveURL(/\/estudios$/)
  await expect(page.getByRole('heading', { name: 'Estudios Clínicos' })).toBeVisible()
})

test('la barra superior se mantiene disponible en viewport móvil', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'CICUC, ir al inicio' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Operación' })).toBeVisible()
})

test('permite seleccionar temas visuales (estándar, alto contraste, daltonismo)', async ({ page }) => {
  await page.goto('/')

  const selectorTema = page.getByRole('combobox', { name: 'Seleccionar tema visual' })
  await expect(selectorTema).toBeVisible()

  // Seleccionar daltonismo
  await selectorTema.selectOption('daltonismo')
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'daltonismo')

  // Seleccionar alto contraste
  await selectorTema.selectOption('alto-contraste')
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'alto-contraste')
})

