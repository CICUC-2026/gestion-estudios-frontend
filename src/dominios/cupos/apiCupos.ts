import { CLAVE_TOKEN } from "../autenticacion/sesionContexto";
import { solicitarApi } from "../../servicios/clienteApi";

export type EstadoCupoDemo =
  | "confirmado"
  | "reservado"
  | "ocupado"
  | "pendiente_reconfirmacion"
  | "cancelado";
export type CupoDemo = {
  id: string;
  estudio_id: string;
  paciente_id: string | null;
  estado: EstadoCupoDemo;
  fuente: string;
  dias_validez: number;
  vence_en: string;
  vencido: boolean;
  vence_pronto: boolean;
  historial: Array<{
    estado_anterior: string | null;
    estado_nuevo: string;
    paciente_id: string | null;
    motivo: string;
    fecha: string;
  }>;
};
const token = () => sessionStorage.getItem(CLAVE_TOKEN);

export const obtenerCuposDemo = () =>
  solicitarApi<CupoDemo[]>("/cupos-demo", {}, token());
export const confirmarCupoDemo = (datos: {
  estudio_id: string;
  fuente: string;
  dias_validez: number;
  motivo: string;
}) =>
  solicitarApi<CupoDemo>(
    "/cupos-demo",
    { method: "POST", body: JSON.stringify(datos) },
    token(),
  );
export const cambiarCupoDemo = (
  id: string,
  datos: {
    estado: EstadoCupoDemo;
    motivo: string;
    paciente_id?: string;
    dias_validez?: number;
    fuente?: string;
  },
) =>
  solicitarApi<CupoDemo>(
    `/cupos-demo/${id}`,
    { method: "PATCH", body: JSON.stringify(datos) },
    token(),
  );
