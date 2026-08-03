export type PacienteDemo = {
  id: string
  codigo: string
  rangoEtario: string
  patologia: string
  estado: string
}

export const CLAVE_PACIENTES_DEMO = 'cicuc-pacientes-demo-v1'

export const pacientesDemoIniciales: PacienteDemo[] = [
  { id: 'demo-inicial', codigo: 'PX-DEMO-0018', rangoEtario: '50–64 años', patologia: 'Patología ficticia A', estado: 'Antecedentes pendientes' },
]

export function leerPacientesDemo(): PacienteDemo[] {
  const almacenados = localStorage.getItem(CLAVE_PACIENTES_DEMO)
  if (!almacenados) return pacientesDemoIniciales
  try {
    const pacientes = JSON.parse(almacenados) as PacienteDemo[]
    return Array.isArray(pacientes) ? pacientes : pacientesDemoIniciales
  } catch {
    return pacientesDemoIniciales
  }
}

export function guardarPacientesDemo(pacientes: PacienteDemo[]) {
  localStorage.setItem(CLAVE_PACIENTES_DEMO, JSON.stringify(pacientes))
}

export function reiniciarPacientesDemo() {
  localStorage.removeItem(CLAVE_PACIENTES_DEMO)
}
