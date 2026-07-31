import { expect, test } from '@playwright/test'

test('protege una ruta y permite iniciar sesión', async ({ page }) => {
  let autenticado = false

  await page.route(/\/api\/v1\//, async (ruta) => {
    const url = ruta.request().url()
    if (url.includes('/autenticacion/ingresar')) {
      autenticado = true
      await ruta.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          token_acceso: 'token-ficticio',
          tipo: 'bearer',
          expira_en: '2026-07-17T20:00:00Z',
        }),
      })
      return
    }
    if (autenticado && url.includes('/autenticacion/yo')) {
      await ruta.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: '00000000-0000-0000-0000-000000000001',
          nombres: 'Ada',
          apellidos: 'Administradora',
          correo: 'admin@example.com',
          es_administrador_sistema: true,
          activo: true,
          ultimo_acceso: null,
          creado_en: '2026-07-17T12:00:00Z',
        }),
      })
      return
    }
    await ruta.fulfill({
      status: 401,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mensaje: 'No autenticado' }),
    })
  })

  await page.goto('/ingresar')
  await expect(page.locator('#correo-ingreso')).toBeVisible({ timeout: 15000 })
  await page.locator('#correo-ingreso').fill('admin@example.com')
  await page.locator('#contrasena-ingreso').fill('Contrasena-Demo-2026')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible({ timeout: 15000 })
})
