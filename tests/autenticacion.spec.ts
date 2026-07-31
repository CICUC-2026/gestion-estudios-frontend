import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.clear()
  })
})

test('protege una ruta y permite iniciar sesión', async ({ page }) => {
  let tokenPresente = false

  await page.route('**/api/v1/autenticacion/ingresar', async (ruta) => {
    tokenPresente = true
    await ruta.fulfill({
      status: 200,
      contentType: 'application/json',
      json: {
        token_acceso: 'token-ficticio',
        tipo: 'bearer',
        expira_en: '2026-07-17T20:00:00Z',
      },
    })
  })

  await page.route('**/api/v1/autenticacion/yo', async (ruta) => {
    if (tokenPresente) {
      await ruta.fulfill({
        status: 200,
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
    } else {
      await ruta.fulfill({
        status: 401,
        contentType: 'application/json',
        json: { mensaje: 'No autenticado' },
      })
    }
  })

  await page.goto('/ingresar', { waitUntil: 'domcontentloaded' })
  const correoInput = page.getByLabel('Correo institucional')
  await correoInput.waitFor({ state: 'visible', timeout: 15000 })
  await correoInput.fill('admin@example.com')
  await page.getByLabel('Contraseña').fill('Contrasena-Demo-2026')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible({ timeout: 15000 })
})
