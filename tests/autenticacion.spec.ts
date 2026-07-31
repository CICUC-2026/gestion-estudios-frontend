import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.clear()
  })
})

test('protege una ruta y permite iniciar sesión', async ({ page }) => {
  let autenticado = false

  await page.route('**/*', async (ruta) => {
    const url = ruta.request().url()
    if (!url.includes('/api/v1/')) {
      await ruta.continue()
      return
    }
    if (url.includes('/autenticacion/ingresar')) {
      autenticado = true
      await ruta.fulfill({
        contentType: 'application/json',
        json: {
          token_acceso: 'token-ficticio',
          tipo: 'bearer',
          expira_en: '2026-07-17T20:00:00Z',
        },
      })
      return
    }
    if (autenticado && url.includes('/autenticacion/yo')) {
      await ruta.fulfill({
        contentType: 'application/json',
        json: {
          id: '00000000-0000-0000-0000-000000000001',
          nombres: 'Ada',
          apellidos: 'Administradora',
          correo: 'admin@example.com',
          es_administrador_sistema: true,
          activo: true,
          ultimo_acceso: null,
          creado_en: '2026-07-17T12:00:00Z',
        },
      })
      return
    }
    await ruta.fulfill({
      status: 401,
      contentType: 'application/json',
      json: { mensaje: 'No autenticado' },
    })
  })

  await page.goto('/ingresar')
  await expect(page.getByLabel('Correo institucional')).toBeVisible()
  await page.getByLabel('Correo institucional').fill('admin@example.com')
  await page.getByLabel('Contraseña').fill('Contrasena-Demo-2026')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()
})
