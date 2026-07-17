import { expect, test } from '@playwright/test'

test('protege una ruta y permite iniciar sesión', async ({ page }) => {
  await page.route('**/api/v1/autenticacion/ingresar', async (ruta) => {
    await ruta.fulfill({
      json: {
        token_acceso: 'token-ficticio',
        tipo: 'bearer',
        expira_en: '2026-07-17T20:00:00Z',
      },
    })
  })
  await page.route('**/api/v1/autenticacion/yo', async (ruta) => {
    await ruta.fulfill({
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
  })

  await page.goto('/pacientes')
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
  await page.getByLabel('Correo institucional').fill('admin@example.com')
  await page.getByLabel('Contraseña').fill('Contrasena-Demo-2026')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await expect(page).toHaveURL(/\/pacientes$/)
  await expect(page.getByRole('heading', { name: 'Pacientes' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()
})
