import { useEffect, useState } from "react";

import {
  descargarExportacionDemo,
  obtenerExportacionesDemo,
  type ExportacionDemo,
  type FormatoExportacion,
} from "../dominios/exportaciones/apiExportaciones";

const opciones: Array<[string, string]> = [
  ["pacientes", "Pacientes sintéticos"], ["diagnosticos", "Antecedentes ficticios"],
  ["estudios", "Estudios"], ["asociaciones", "Asociaciones administrativas"],
  ["tareas", "Tareas"], ["preselecciones", "Preselecciones manuales"], ["cupos", "Cupos"],
];

export function PaginaExportacionesDemo() {
  const [registros, setRegistros] = useState<ExportacionDemo[]>([]);
  const [formato, setFormato] = useState<FormatoExportacion>("xlsx");
  const [finalidad, setFinalidad] = useState("Preparar demostración verificable");
  const [entidades, setEntidades] = useState(opciones.map(([valor]) => valor));
  const [mensaje, setMensaje] = useState("");
  useEffect(() => {
    void obtenerExportacionesDemo().then(setRegistros).catch(() => setMensaje("Solo un administrador puede consultar exportaciones."));
  }, []);

  function alternar(entidad: string) {
    setEntidades((actual) => actual.includes(entidad) ? actual.filter((v) => v !== entidad) : [...actual, entidad]);
  }
  async function generar(evento: React.FormEvent) {
    evento.preventDefault();
    try {
      const descarga = await descargarExportacionDemo({ finalidad, formato, entidades });
      const url = URL.createObjectURL(descarga.archivo);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = descarga.nombre;
      enlace.click();
      URL.revokeObjectURL(url);
      setRegistros(await obtenerExportacionesDemo());
      setMensaje(`Archivo privado generado. SHA-256: ${descarga.hash.slice(0, 16)}…`);
    } catch {
      setMensaje("La exportación fue rechazada o no pudo generarse.");
    }
  }
  return <>
    <section className="encabezado-pagina"><div><p className="sobrelinea">Administración · Solo datos ficticios</p><h1>Exportaciones sintéticas</h1><p>Selecciona el contenido y descarga un archivo privado con trazabilidad.</p></div></section>
    <aside className="aviso-prototipo"><strong>Autorización de administrador</strong><span>No se genera SQL, enlaces públicos ni archivos permanentes en el servidor.</span></aside>
    {mensaje ? <p className="mensaje-accion-demo" role="status">{mensaje}</p> : null}
    <form className="formulario-tarea" onSubmit={(e) => void generar(e)}>
      <label>Finalidad<input value={finalidad} onChange={(e) => setFinalidad(e.target.value)} required /></label>
      <label>Formato<select value={formato} onChange={(e) => setFormato(e.target.value as FormatoExportacion)}><option value="xlsx">Excel XLSX</option><option value="csv">CSV</option><option value="json">JSON</option><option value="txt">Texto libre estructurado</option></select></label>
      <fieldset><legend>Información incluida</legend>{opciones.map(([valor, etiqueta]) => <label key={valor}><input type="checkbox" checked={entidades.includes(valor)} onChange={() => alternar(valor)} /> {etiqueta}</label>)}</fieldset>
      <button className="boton-primario" type="submit" disabled={!entidades.length}>Autorizar y descargar</button>
    </form>
    <section className="panel-tabla"><div className="cabecera-tabla"><h2>Historial verificable</h2><span>{registros.length} registros</span></div><div className="tabla-desplazable"><table><thead><tr><th>Fecha</th><th>Formato</th><th>Cantidad</th><th>Finalidad</th><th>Hash</th></tr></thead><tbody>{registros.map((item) => <tr key={item.id}><td>{new Date(item.creada_en).toLocaleString("es-CL")}</td><td>{item.formato.toUpperCase()}</td><td>{item.cantidad}</td><td>{item.finalidad}</td><td><code>{item.hash_sha256.slice(0, 16)}…</code></td></tr>)}</tbody></table></div></section>
  </>;
}
