import { expect, test } from '@playwright/test'

test('sesión completa contra la API real', async ({ page }) => {
  test.skip(process.env.E2E_API_REAL !== 'true', 'Requiere backend y PostgreSQL locales')

  await page.goto('/pacientes')
  await page.getByLabel('Correo institucional').fill('admin@example.com')
  await page.getByLabel('Contraseña').fill('Contrasena-Demo-2026')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await expect(page).toHaveURL(/\/pacientes$/)
  await expect(page.getByRole('heading', { name: 'Pacientes' })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
})
