import { Navigate, Route, Routes } from "react-router-dom";

import { LayoutPrincipal } from "../aplicacion/LayoutPrincipal";
import { PaginaInicio } from "../paginas/PaginaInicio";
import { PaginaIngreso } from "../paginas/PaginaIngreso";
import { PaginaModulo } from "../paginas/PaginaModulo";
import { PaginaEstudios } from "../paginas/PaginaEstudios";
import { PaginaDetalleEstudio } from "../paginas/PaginaDetalleEstudio";
import { PaginaNoEncontrada } from "../paginas/PaginaNoEncontrada";
import { PaginaPacientesDemo } from "../paginas/PaginaPacientesDemo";
import { PaginaPreseleccionDemo } from "../paginas/PaginaPreseleccionDemo";
import { RutaProtegida } from "./RutaProtegida";

export function RutasAplicacion() {
  return (
    <Routes>
      <Route path="ingresar" element={<PaginaIngreso />} />
      <Route element={<RutaProtegida />}>
        <Route element={<LayoutPrincipal />}>
          <Route index element={<PaginaInicio />} />
          <Route path="estudios" element={<PaginaEstudios />} />
          <Route path="estudios/:id" element={<PaginaDetalleEstudio />} />
          <Route path="pacientes" element={<PaginaPacientesDemo />} />
          <Route path="preseleccion" element={<PaginaPreseleccionDemo />} />
          <Route
            path="operacion"
            element={<PaginaModulo modulo="operacion" />}
          />
          <Route path="reportes" element={<PaginaModulo modulo="reportes" />} />
          <Route path="inicio" element={<Navigate replace to="/" />} />
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}
