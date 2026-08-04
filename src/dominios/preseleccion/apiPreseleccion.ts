import { CLAVE_TOKEN } from "../autenticacion/sesionContexto";
import { solicitarApi } from "../../servicios/clienteApi";

export type EstadoPreseleccionDemo =
  | "pendiente_revision"
  | "en_revision"
  | "informacion_incompleta"
  | "posible_barrera"
  | "posible_estudio_revisar"
  | "derivado_screening_formal"
  | "cerrado";
export type EstadoEvaluacionDemo =
  | "aparentemente_cumplido"
  | "pendiente_verificar"
  | "dudoso"
  | "aparentemente_no_cumplido"
  | "no_corresponde";
export type EvaluacionDemo = {
  id: string;
  criterio_id: string;
  estado: EstadoEvaluacionDemo;
  comentario: string;
  fuente: string;
  actualizada_en: string;
};
export type PreseleccionDemo = {
  id: string;
  paciente_id: string;
  estudio_id: string;
  version_id: string;
  estado: EstadoPreseleccionDemo;
  resumen: string | null;
  evaluaciones: EvaluacionDemo[];
  historial: Array<{
    estado_anterior: string | null;
    estado_nuevo: string;
    motivo: string;
    fecha: string;
  }>;
};
const token = () => sessionStorage.getItem(CLAVE_TOKEN);

export const obtenerPreseleccionesDemo = () =>
  solicitarApi<PreseleccionDemo[]>("/preselecciones-demo", {}, token());
export const crearPreseleccionDemo = (datos: {
  paciente_id: string;
  estudio_id: string;
  version_id: string;
  motivo: string;
}) =>
  solicitarApi<PreseleccionDemo>(
    "/preselecciones-demo",
    { method: "POST", body: JSON.stringify(datos) },
    token(),
  );
export const evaluarCriterioDemo = (
  id: string,
  criterioId: string,
  datos: { estado: EstadoEvaluacionDemo; comentario: string; fuente: string },
) =>
  solicitarApi<PreseleccionDemo>(
    `/preselecciones-demo/${id}/criterios/${criterioId}`,
    { method: "PUT", body: JSON.stringify(datos) },
    token(),
  );
export const cambiarEstadoPreseleccionDemo = (
  id: string,
  datos: { estado: EstadoPreseleccionDemo; motivo: string; resumen?: string },
) =>
  solicitarApi<PreseleccionDemo>(
    `/preselecciones-demo/${id}/estado`,
    { method: "PATCH", body: JSON.stringify(datos) },
    token(),
  );
