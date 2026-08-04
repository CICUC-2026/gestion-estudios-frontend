import { CLAVE_TOKEN } from "../autenticacion/sesionContexto";
import { descargarApi, solicitarApi } from "../../servicios/clienteApi";

export type FormatoExportacion = "xlsx" | "csv" | "json" | "txt";
export type ExportacionDemo = {
  id: string;
  finalidad: string;
  formato: FormatoExportacion;
  cantidad: number;
  hash_sha256: string;
  creada_en: string;
};
const token = () => sessionStorage.getItem(CLAVE_TOKEN);

export const obtenerExportacionesDemo = () =>
  solicitarApi<ExportacionDemo[]>("/exportaciones-demo", {}, token());
export const descargarExportacionDemo = (datos: {
  finalidad: string;
  formato: FormatoExportacion;
  entidades: string[];
  estudio_id?: string;
}) =>
  descargarApi(
    "/exportaciones-demo",
    { method: "POST", body: JSON.stringify(datos) },
    token(),
  );
