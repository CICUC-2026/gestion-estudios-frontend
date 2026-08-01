type Fila = Record<string, string>

type DatosModulo = {
  titulo: string
  descripcion: string
  accion: string
  indicadores: Array<{ etiqueta: string; valor: string; detalle: string }>
  columnas: Array<{ clave: string; etiqueta: string }>
  filas: Fila[]
}

type Modulo = 'estudios' | 'pacientes' | 'operacion' | 'reportes'

const modulos: Record<Modulo, DatosModulo> = {
  estudios: {
    titulo: 'Estudios',
    descripcion: 'Protocolos oncológicos disponibles y su estado operativo en la unidad.',
    accion: 'Nuevo estudio',
    indicadores: [
      { etiqueta: 'Estudios activos', valor: '8', detalle: '3 con cupos disponibles' },
      { etiqueta: 'En revisión', valor: '3', detalle: 'Actualizados esta semana' },
      { etiqueta: 'Cerrados', valor: '12', detalle: 'Histórico de demostración' },
    ],
    columnas: [
      { clave: 'codigo', etiqueta: 'Código' }, { clave: 'nombre', etiqueta: 'Estudio' },
      { clave: 'fase', etiqueta: 'Fase' }, { clave: 'tumor', etiqueta: 'Patología' },
      { clave: 'estado', etiqueta: 'Estado' }, { clave: 'actualizado', etiqueta: 'Actualización' },
    ],
    filas: [
      { codigo: 'CICUC-DEM-101', nombre: 'Aurora', fase: 'II', tumor: 'Mama', estado: 'Activo · con cupos', actualizado: 'Hoy, 09:30' },
      { codigo: 'CICUC-DEM-117', nombre: 'Cordillera', fase: 'III', tumor: 'Pulmón', estado: 'Activo · revisión', actualizado: 'Ayer, 16:10' },
      { codigo: 'CICUC-DEM-124', nombre: 'Pacífico', fase: 'II', tumor: 'Colorrectal', estado: 'Activo · sin cupos', actualizado: '15 jul 2026' },
      { codigo: 'CICUC-DEM-132', nombre: 'Arrayán', fase: 'I/II', tumor: 'Próstata', estado: 'Borrador', actualizado: '14 jul 2026' },
      { codigo: 'CICUC-DEM-140', nombre: 'Estrella Sur', fase: 'III', tumor: 'Melanoma', estado: 'Activo · con cupos', actualizado: '12 jul 2026' },
    ],
  },
  pacientes: {
    titulo: 'Pacientes',
    descripcion: 'Casos ficticios y minimizados para probar la coordinación sin utilizar identidades reales.',
    accion: 'Registrar paciente de prueba',
    indicadores: [
      { etiqueta: 'Casos en seguimiento', valor: '24', detalle: 'Datos anonimizados' },
      { etiqueta: 'Por revisar', valor: '6', detalle: 'Sin decisión automática' },
      { etiqueta: 'Actualizados hoy', valor: '4', detalle: 'Trazabilidad activa' },
    ],
    columnas: [
      { clave: 'codigo', etiqueta: 'Código de caso' }, { clave: 'rango', etiqueta: 'Rango etario' },
      { clave: 'diagnostico', etiqueta: 'Diagnóstico informado' }, { clave: 'estudio', etiqueta: 'Estudio asociado' },
      { clave: 'estado', etiqueta: 'Seguimiento' }, { clave: 'responsable', etiqueta: 'Responsable' },
    ],
    filas: [
      { codigo: 'PX-DEMO-0018', rango: '50–59', diagnostico: 'Mama', estudio: 'Aurora', estado: 'Antecedentes pendientes', responsable: 'Dra. Elena Demo' },
      { codigo: 'PX-DEMO-0021', rango: '60–69', diagnostico: 'Pulmón', estudio: 'Cordillera', estado: 'Revisión manual', responsable: 'Dr. Mateo Ejemplo' },
      { codigo: 'PX-DEMO-0027', rango: '40–49', diagnostico: 'Colorrectal', estudio: 'Pacífico', estado: 'Seguimiento', responsable: 'Enf. Sofía Prueba' },
      { codigo: 'PX-DEMO-0032', rango: '60–69', diagnostico: 'Próstata', estudio: 'Por asociar', estado: 'Caso nuevo', responsable: 'Dra. Elena Demo' },
      { codigo: 'PX-DEMO-0035', rango: '30–39', diagnostico: 'Melanoma', estudio: 'Estrella Sur', estado: 'Comité pendiente', responsable: 'Dr. Mateo Ejemplo' },
    ],
  },
  operacion: {
    titulo: 'Operación',
    descripcion: 'Vista ficticia de cupos, tareas y coordinaciones pendientes de confirmación humana.',
    accion: 'Nueva tarea',
    indicadores: [
      { etiqueta: 'Tareas pendientes', valor: '11', detalle: '3 para hoy' },
      { etiqueta: 'Cupos informados', valor: '7', detalle: '2 requieren actualización' },
      { etiqueta: 'Comités próximos', valor: '2', detalle: 'Esta semana' },
    ],
    columnas: [
      { clave: 'prioridad', etiqueta: 'Prioridad operativa' }, { clave: 'tarea', etiqueta: 'Tarea' },
      { clave: 'caso', etiqueta: 'Caso/estudio' }, { clave: 'responsable', etiqueta: 'Responsable' },
      { clave: 'plazo', etiqueta: 'Plazo' }, { clave: 'estado', etiqueta: 'Estado' },
    ],
    filas: [
      { prioridad: 'Alta', tarea: 'Confirmar vigencia de cupos', caso: 'Aurora', responsable: 'Sofía Prueba', plazo: 'Hoy, 12:00', estado: 'Pendiente' },
      { prioridad: 'Alta', tarea: 'Completar antecedentes', caso: 'PX-DEMO-0018', responsable: 'Elena Demo', plazo: 'Hoy, 16:00', estado: 'En curso' },
      { prioridad: 'Media', tarea: 'Preparar comité semanal', caso: '5 casos demo', responsable: 'Mateo Ejemplo', plazo: 'Mañana', estado: 'Pendiente' },
      { prioridad: 'Media', tarea: 'Actualizar contacto del centro', caso: 'Cordillera', responsable: 'Sofía Prueba', plazo: '20 jul', estado: 'Pendiente' },
      { prioridad: 'Baja', tarea: 'Revisar protocolo archivado', caso: 'CICUC-DEM-088', responsable: 'Elena Demo', plazo: '24 jul', estado: 'Programada' },
    ],
  },
  reportes: {
    titulo: 'Reportes',
    descripcion: 'Indicadores operativos ficticios con fecha de corte; no representan resultados clínicos.',
    accion: 'Preparar reporte',
    indicadores: [
      { etiqueta: 'Casos del mes', valor: '18', detalle: '+3 respecto al período demo' },
      { etiqueta: 'Tareas completadas', valor: '86%', detalle: 'Indicador operativo' },
      { etiqueta: 'Estudios con cupos', valor: '3', detalle: 'Corte: hoy 09:30' },
    ],
    columnas: [
      { clave: 'reporte', etiqueta: 'Reporte' }, { clave: 'periodo', etiqueta: 'Período' },
      { clave: 'alcance', etiqueta: 'Alcance' }, { clave: 'generado', etiqueta: 'Última generación' },
      { clave: 'estado', etiqueta: 'Estado' }, { clave: 'autor', etiqueta: 'Generado por' },
    ],
    filas: [
      { reporte: 'Resumen operativo semanal', periodo: '13–17 jul', alcance: 'Unidad demo', generado: 'Hoy, 09:45', estado: 'Disponible', autor: 'Administrador CICUC' },
      { reporte: 'Vigencia de cupos', periodo: 'Corte actual', alcance: '5 estudios', generado: 'Hoy, 09:31', estado: 'Revisar 2 fuentes', autor: 'Sofía Prueba' },
      { reporte: 'Seguimiento de tareas', periodo: 'Julio 2026', alcance: 'Equipo demo', generado: '16 jul 2026', estado: 'Disponible', autor: 'Administrador CICUC' },
      { reporte: 'Actividad de estudios', periodo: '2.º trimestre', alcance: 'Datos ficticios', generado: '10 jul 2026', estado: 'Archivado', autor: 'Mateo Ejemplo' },
    ],
  },
}

export function PaginaModulo({ modulo }: { modulo: Modulo }) {
  const datos = modulos[modulo]
  const [filasPorModulo, setFilasPorModulo] = useState<Record<Modulo, Fila[]>>(() => ({
    estudios: modulos.estudios.filas,
    pacientes: modulos.pacientes.filas,
    operacion: modulos.operacion.filas,
    reportes: modulos.reportes.filas,
  }))
  const filas = filasPorModulo[modulo]
  const [mensaje, setMensaje] = useState<string | null>(null)

  const agregarFila = (fila: Fila) => {
    setFilasPorModulo((actuales) => ({ ...actuales, [modulo]: [fila, ...actuales[modulo]] }))
  }

  function ejecutarAccion() {
    if (modulo === 'pacientes') {
      const correlativo = String(filas.length + 36).padStart(4, '0')
      agregarFila({ codigo: `PX-DEMO-${correlativo}`, rango: 'Sin registrar', diagnostico: 'Pendiente', estudio: 'Por asociar', estado: 'Caso demo nuevo', responsable: 'Sin asignar' })
      setMensaje('Paciente de prueba agregado temporalmente. No fue persistido en el backend.')
      return
    }
    if (modulo === 'operacion') {
      agregarFila({ prioridad: 'Media', tarea: 'Nueva tarea de demostración', caso: 'Por asociar', responsable: 'Sin asignar', plazo: 'Sin definir', estado: 'Borrador demo' })
      setMensaje('Tarea de prueba agregada temporalmente. No fue persistida en el backend.')
      return
    }
    if (modulo === 'reportes') {
      const encabezado = datos.columnas.map((columna) => columna.etiqueta)
      const escapar = (valor: string) => `"${valor.replaceAll('"', '""')}"`
      const contenido = [encabezado, ...filas.map((fila) => datos.columnas.map((columna) => fila[columna.clave] ?? ''))]
        .map((fila) => fila.map(escapar).join(','))
        .join('\n')
      const url = URL.createObjectURL(new Blob([contenido], { type: 'text/csv;charset=utf-8' }))
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = 'reporte-operativo-demo.csv'
      enlace.click()
      URL.revokeObjectURL(url)
      setMensaje('Reporte demo preparado y descargado como CSV.')
    }
  }

  return (
    <>
      <section className="encabezado-pagina">
        <div><p className="sobrelinea">Entorno de demostración</p><h1>{datos.titulo}</h1><p>{datos.descripcion}</p></div>
        <button className="boton-primario" type="button" onClick={ejecutarAccion}>{datos.accion}</button>
      </section>
      {mensaje ? <p className="mensaje-accion-demo" role="status">{mensaje}</p> : null}
      <section className="rejilla-indicadores" aria-label={`Indicadores de ${datos.titulo}`}>
        {datos.indicadores.map((item) => <article className="tarjeta-indicador" key={item.etiqueta}><p>{item.etiqueta}</p><strong>{item.valor}</strong><small>{item.detalle}</small></article>)}
      </section>
      <section className="panel-tabla">
        <div className="cabecera-tabla"><div><p className="sobrelinea">Información ficticia</p><h2>Vista general</h2></div><span>{filas.length} registros demo</span></div>
        <div className="tabla-desplazable"><table><thead><tr>{datos.columnas.map((columna) => <th key={columna.clave}>{columna.etiqueta}</th>)}</tr></thead><tbody>{filas.map((fila, indice) => <tr key={`${modulo}-${indice}`}>{datos.columnas.map((columna) => <td data-label={columna.etiqueta} key={columna.clave}>{fila[columna.clave]}</td>)}</tr>)}</tbody></table></div>
      </section>
    </>
  )
}
import { useState } from 'react'
