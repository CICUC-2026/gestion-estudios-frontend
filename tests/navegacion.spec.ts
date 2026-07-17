import { expect, test } from '@playwright/test'

test('navega mediante la barra superior y conserva idioma español', async ({ page }) => {
  await page.goto('/')

  const navegacion = page.getByRole('navigation', { name: 'Navegación principal' })
  await expect(navegacion).toBeVisible()
  await page.getByRole('link', { name: 'Estudios' }).click()
  await expect(page).toHaveURL(/\/estudios$/)
  await expect(page.getByRole('heading', { name: 'Estudios' })).toBeVisible()
})

test('la barra superior se mantiene disponible en viewport móvil', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'CICUC, ir al inicio' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Operación' })).toBeVisible()
})
