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
  const tareas: Array<Record<string, unknown>> = []
  const reportes: Array<Record<string, unknown>> = []
  const pacientes: Array<Record<string, unknown>> = [{ id: 'paciente-demo-1', codigo: 'PX-DEMO-0001', rango_etario: '50–64 años', patologia: 'Ficticia', estado: 'antecedentes_pendientes', sintetico: true, archivado: false }]
  const preselecciones: Array<Record<string, unknown>> = []
  const estudioDemo = { id: 'estudio-demo-1', codigo_interno: 'EST-DEMO-1', titulo: 'Estudio ficticio', patrocinador: 'Demo', fase: 'Demo', patologia: 'Ficticia', escenario_clinico: 'Ficticio', linea_tratamiento: 'Ficticia', centro_atencion: 'CICUC', estado_operacional: 'activado', disponibilidad: 'con_cupo', estado: 'vigente', disponible: true, fuente_informacion: 'Demo', fecha_corte: null, fecha_verificacion: null, proxima_revision: null, etiqueta_vigencia: 'vigente', observaciones: null, creado_en: new Date().toISOString(), actualizado_en: new Date().toISOString(), cohortes: [], historial_estados: [], version_vigente: { id: 'version-demo-1', numero_version: '1.0', criterios: [{ id: 'criterio-demo-1', codigo_criterio: 'INC-DEMO', descripcion: 'Criterio exclusivamente ficticio' }] } }
  await page.route('**/api/v1/tareas**', async (ruta) => {
    if (ruta.request().method() === 'PATCH') {
      const datos = ruta.request().postDataJSON() as { estado: string }
      const tarea = tareas[0] ?? {}
      Object.assign(tarea, datos)
      await ruta.fulfill({ json: tarea }); return
    }
    if (ruta.request().method() === 'POST') {
      const datos = ruta.request().postDataJSON() as { titulo: string }
      const tarea = { id: crypto.randomUUID(), titulo: datos.titulo, descripcion: null, prioridad: 'media', estado: 'pendiente', vence_en: null, creada_en: new Date().toISOString() }
      tareas.unshift(tarea)
      await ruta.fulfill({ status: 201, json: tarea }); return
    }
    await ruta.fulfill({ json: tareas })
  })
  await page.route('**/api/v1/pacientes-demo**', async (ruta) => {
    if (ruta.request().method() === 'POST' && !ruta.request().url().includes('/diagnosticos') && !ruta.request().url().includes('/estudios')) {
      const datos = ruta.request().postDataJSON() as Record<string, unknown>
      const paciente = { id: crypto.randomUUID(), ...datos, sintetico: true, archivado: false, creado_en: new Date().toISOString(), actualizado_en: new Date().toISOString() }
      pacientes.unshift(paciente)
      await ruta.fulfill({ status: 201, json: paciente }); return
    }
    await ruta.fulfill({ json: pacientes })
  })
  await page.route('**/api/v1/reportes', async (ruta) => {
    if (ruta.request().method() === 'POST') {
      const reporte = { id: crypto.randomUUID(), nombre: 'Resumen operativo', finalidad: 'Seguimiento', fecha_corte: new Date().toISOString(), contenido: { estudios: 3, tareas_pendientes: tareas.length }, creado_en: new Date().toISOString() }
      reportes.unshift(reporte)
      await ruta.fulfill({ status: 201, json: reporte }); return
    }
    await ruta.fulfill({ json: reportes })
  })
  await page.route('**/api/v1/estudios**', async (ruta) => {
    await ruta.fulfill({ json: [estudioDemo] })
  })
  await page.route('**/api/v1/preselecciones-demo**', async (ruta) => {
    if (ruta.request().method() === 'POST') {
      const datos = ruta.request().postDataJSON() as Record<string, unknown>
      const item = { id: 'preseleccion-demo-1', ...datos, estado: 'pendiente_revision', resumen: null, evaluaciones: [], historial: [] }
      preselecciones.unshift(item); await ruta.fulfill({ status: 201, json: item }); return
    }
    if (ruta.request().method() === 'PUT') {
      const item = preselecciones[0] ?? {}
      item.evaluaciones = [{ id: 'evaluacion-1', criterio_id: 'criterio-demo-1', ...(ruta.request().postDataJSON() as object) }]
      await ruta.fulfill({ json: item }); return
    }
    await ruta.fulfill({ json: preselecciones })
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
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'CICUC, ir al inicio' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Operación' })).toBeVisible()
  const enlaceEstudios = page.getByRole('link', { name: 'Estudios' })
  await enlaceEstudios.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/estudios$/)
  await expect(page.getByRole('heading', { name: 'Estudios Clínicos' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Operación' })).toBeVisible()
})

test('permite seleccionar temas visuales (estándar, alto contraste, daltonismo)', async ({ page }) => {
  await page.goto('/')

  const selectorTema = page.getByRole('combobox', { name: 'Seleccionar tema visual' })
  await expect(selectorTema).toBeVisible()

  // Seleccionar daltonismo
  await selectorTema.selectOption('daltonismo')
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'daltonismo')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'daltonismo')
  await expect(selectorTema).toHaveValue('daltonismo')

  // Seleccionar alto contraste
  await selectorTema.selectOption('alto-contraste')
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'alto-contraste')

  await page.keyboard.press('Tab')
  const foco = page.locator(':focus-visible')
  await expect(foco).toBeVisible()
  const contorno = await foco.evaluate((elemento) => getComputedStyle(elemento).outlineStyle)
  expect(contorno).not.toBe('none')
})

test('pacientes y tareas se persisten mediante la API', async ({ page }) => {
  await page.goto('./pacientes')
  await expect(page.getByText('Solo datos ficticios')).toBeVisible()
  await page.getByRole('button', { name: 'Agregar paciente sintético' }).click()
  await page.getByLabel('Código ficticio').fill('PX-DEMO-0021')
  await page.getByLabel('Patología ficticia').fill('Patología ficticia B')
  await page.getByRole('button', { name: 'Guardar en PostgreSQL' }).click()
  await expect(page.getByRole('status')).toContainText('persistido en PostgreSQL')
  await expect(page.getByText('PX-DEMO-0021')).toBeVisible()
  await page.reload()
  await expect(page.getByText('PX-DEMO-0021')).toBeVisible()

  await page.getByRole('link', { name: 'Operación' }).click()
  await page.getByRole('button', { name: 'Nueva tarea' }).click()
  await page.getByLabel('Título de la tarea').fill('Confirmar vigencia de cupos')
  await page.getByRole('button', { name: 'Guardar tarea' }).click()
  await expect(page.getByRole('status')).toContainText('persistida en PostgreSQL')
  await expect(page.getByText('1 registros')).toBeVisible()
  await page.getByRole('button', { name: 'Completar' }).click()
  await expect(page.getByRole('status')).toContainText('completada')

  await page.getByRole('link', { name: 'Reportes' }).click()
  await page.getByRole('button', { name: 'Preparar reporte' }).click()
  await expect(page.getByRole('status')).toContainText('persistido en PostgreSQL')
  await expect(page.getByText('1 registros')).toBeVisible()
})

test('crea y evalúa una preselección exclusivamente sintética', async ({ page }) => {
  await page.goto('./preseleccion')
  await expect(page.getByText('Sin elegibilidad automática')).toBeVisible()
  await page.getByRole('button', { name: 'Crear revisión manual' }).click()
  await expect(page.getByRole('status')).toContainText('no determina elegibilidad')
  await page.getByRole('button', { name: 'Revisar' }).click()
  await expect(page.getByText('Criterio exclusivamente ficticio')).toBeVisible()
  await page.getByLabel('Evaluación manual').selectOption('dudoso')
  await expect(page.getByRole('status')).toContainText('no constituye elegibilidad')
})
