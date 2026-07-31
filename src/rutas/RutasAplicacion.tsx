import { Navigate, Route, Routes } from 'react-router-dom'

import { LayoutPrincipal } from '../aplicacion/LayoutPrincipal'
import { PaginaInicio } from '../paginas/PaginaInicio'
import { PaginaIngreso } from '../paginas/PaginaIngreso'
import { PaginaModulo } from '../paginas/PaginaModulo'
import { PaginaNoEncontrada } from '../paginas/PaginaNoEncontrada'
import { RutaProtegida } from './RutaProtegida'

export function RutasAplicacion() {
  return (
    <Routes>
      <Route path="ingresar" element={<PaginaIngreso />} />
      <Route element={<RutaProtegida />}>
        <Route element={<LayoutPrincipal />}>
          <Route index element={<PaginaInicio />} />
          <Route path="estudios" element={<PaginaModulo modulo="estudios" />} />
          <Route path="pacientes" element={<PaginaModulo modulo="pacientes" />} />
          <Route path="operacion" element={<PaginaModulo modulo="operacion" />} />
          <Route path="reportes" element={<PaginaModulo modulo="reportes" />} />
          <Route path="inicio" element={<Navigate replace to="/" />} />
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  )
}
