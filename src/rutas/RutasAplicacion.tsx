import { Navigate, Route, Routes } from 'react-router-dom'

import { LayoutPrincipal } from '../aplicacion/LayoutPrincipal'
import { PaginaInicio } from '../paginas/PaginaInicio'
import { PaginaModulo } from '../paginas/PaginaModulo'
import { PaginaNoEncontrada } from '../paginas/PaginaNoEncontrada'

export function RutasAplicacion() {
  return (
    <Routes>
      <Route element={<LayoutPrincipal />}>
        <Route index element={<PaginaInicio />} />
        <Route path="estudios" element={<PaginaModulo titulo="Estudios" />} />
        <Route path="pacientes" element={<PaginaModulo titulo="Pacientes" />} />
        <Route path="operacion" element={<PaginaModulo titulo="Operación" />} />
        <Route path="reportes" element={<PaginaModulo titulo="Reportes" />} />
        <Route path="inicio" element={<Navigate replace to="/" />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Route>
    </Routes>
  )
}
