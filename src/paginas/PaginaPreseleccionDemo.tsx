import { useEffect, useMemo, useState } from "react";

import { obtenerEstudios } from "../dominios/estudios/apiEstudios";
import type { Estudio } from "../dominios/estudios/tipos";
import {
  obtenerPacientesDemo,
  type PacienteDemo,
} from "../dominios/pacientes/apiPacientes";
import {
  cambiarEstadoPreseleccionDemo,
  crearPreseleccionDemo,
  evaluarCriterioDemo,
  obtenerPreseleccionesDemo,
  type EstadoEvaluacionDemo,
  type EstadoPreseleccionDemo,
  type PreseleccionDemo,
} from "../dominios/preseleccion/apiPreseleccion";

const estados: Array<[EstadoPreseleccionDemo, string]> = [
  ["pendiente_revision", "Pendiente de revisión"],
  ["en_revision", "En revisión"],
  ["informacion_incompleta", "Información incompleta"],
  ["posible_barrera", "Posible barrera"],
  ["posible_estudio_revisar", "Posible estudio a revisar"],
  ["derivado_screening_formal", "Derivado a screening formal"],
  ["cerrado", "Cerrado"],
];
const evaluaciones: Array<[EstadoEvaluacionDemo, string]> = [
  ["aparentemente_cumplido", "Aparentemente cumplido"],
  ["pendiente_verificar", "Pendiente de verificar"],
  ["dudoso", "Dudoso"],
  ["aparentemente_no_cumplido", "Aparentemente no cumplido"],
  ["no_corresponde", "No corresponde"],
];

export function PaginaPreseleccionDemo() {
  const [items, setItems] = useState<PreseleccionDemo[]>([]);
  const [pacientes, setPacientes] = useState<PacienteDemo[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [estudioId, setEstudioId] = useState("");
  const [seleccion, setSeleccion] = useState<PreseleccionDemo | null>(null);
  const [mensaje, setMensaje] = useState("");
  const estudio = useMemo(
    () => estudios.find((e) => e.id === estudioId),
    [estudios, estudioId],
  );
  const estudioSeleccion = useMemo(
    () => estudios.find((e) => e.id === seleccion?.estudio_id),
    [estudios, seleccion],
  );

  async function cargar() {
    const [revisiones, casos, inventario] = await Promise.all([
      obtenerPreseleccionesDemo(),
      obtenerPacientesDemo(),
      obtenerEstudios(),
    ]);
    setItems(revisiones);
    setPacientes(casos);
    setEstudios(inventario);
    setPacienteId((v) => v || casos[0]?.id || "");
    setEstudioId(
      (v) => v || inventario.find((e) => e.version_vigente)?.id || "",
    );
  }
  useEffect(() => {
    void Promise.all([
      obtenerPreseleccionesDemo(),
      obtenerPacientesDemo(),
      obtenerEstudios(),
    ])
      .then(([revisiones, casos, inventario]) => {
        setItems(revisiones);
        setPacientes(casos);
        setEstudios(inventario);
        setPacienteId(casos[0]?.id ?? "");
        setEstudioId(inventario.find((e) => e.version_vigente)?.id ?? "");
      })
      .catch(() => setMensaje("No fue posible cargar la preselección sintética."));
  }, []);

  async function crear(evento: React.FormEvent) {
    evento.preventDefault();
    if (!estudio?.version_vigente)
      return setMensaje("El estudio requiere una versión vigente.");
    const item = await crearPreseleccionDemo({
      paciente_id: pacienteId,
      estudio_id: estudio.id,
      version_id: estudio.version_vigente.id,
      motivo: "Inicio manual de demostración",
    });
    await cargar();
    setSeleccion(item);
    setMensaje(
      "Revisión administrativa sintética creada; no determina elegibilidad.",
    );
  }

  async function transicionar(estado: EstadoPreseleccionDemo) {
    if (!seleccion) return;
    const item = await cambiarEstadoPreseleccionDemo(seleccion.id, {
      estado,
      motivo: "Transición manual de demostración",
      resumen:
        estado === "cerrado" ? "Cierre administrativo sintético" : undefined,
    });
    setSeleccion(item);
    await cargar();
    setMensaje("Estado actualizado y auditado.");
  }

  async function evaluar(criterioId: string, estado: EstadoEvaluacionDemo) {
    if (!seleccion) return;
    const item = await evaluarCriterioDemo(seleccion.id, criterioId, {
      estado,
      comentario: "Evaluación manual sintética",
      fuente: "Fuente ficticia de demostración",
    });
    setSeleccion(item);
    setMensaje("Criterio registrado manualmente; no constituye elegibilidad.");
  }

  return (
    <>
      <section className="encabezado-pagina">
        <div>
          <p className="sobrelinea">Demo manual · No clínica</p>
          <h1>Preselección sintética</h1>
          <p>
            Revisión humana trazable contra una versión exacta del protocolo.
          </p>
        </div>
      </section>
      <aside className="aviso-prototipo">
        <strong>Sin elegibilidad automática</strong>
        <span>
          Los estados expresan revisión administrativa de datos ficticios.
        </span>
      </aside>
      {mensaje ? (
        <p className="mensaje-accion-demo" role="status">
          {mensaje}
        </p>
      ) : null}
      <form
        className="formulario-paciente-demo"
        onSubmit={(e) => void crear(e)}
      >
        <label>
          Paciente sintético
          <select
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
          >
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estudio con versión
          <select
            value={estudioId}
            onChange={(e) => setEstudioId(e.target.value)}
          >
            {estudios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.codigo_interno} ·{" "}
                {e.version_vigente
                  ? `v${e.version_vigente.numero_version}`
                  : "sin versión vigente"}
              </option>
            ))}
          </select>
        </label>
        <button className="boton-primario" type="submit">
          Crear revisión manual
        </button>
      </form>
      <section className="panel-tabla">
        <div className="cabecera-tabla">
          <h2>Revisiones persistentes</h2>
          <span>{items.length} registros</span>
        </div>
        <div className="tabla-desplazable">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Estudio</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {pacientes.find((p) => p.id === item.paciente_id)?.codigo}
                  </td>
                  <td>
                    {
                      estudios.find((e) => e.id === item.estudio_id)
                        ?.codigo_interno
                    }
                  </td>
                  <td>{estados.find(([v]) => v === item.estado)?.[1]}</td>
                  <td>
                    <button type="button" onClick={() => setSeleccion(item)}>
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {seleccion ? (
        <section className="panel-vacio">
          <p className="sobrelinea">Revisión administrativa sintética</p>
          <h2>
            Criterios de versión{" "}
            {estudioSeleccion?.version_vigente?.numero_version}
          </h2>
          <div className="formulario-paciente-demo">
            <label>
              Estado de la revisión
              <select
                value={seleccion.estado}
                onChange={(e) =>
                  void transicionar(e.target.value as EstadoPreseleccionDemo)
                }
              >
                {estados.map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {estudioSeleccion?.version_vigente?.criterios.map((criterio) => (
            <div className="formulario-paciente-demo" key={criterio.id}>
              <p>
                <strong>{criterio.codigo_criterio}</strong>
                <br />
                {criterio.descripcion}
              </p>
              <label>
                Evaluación manual
                <select
                  value={
                    seleccion.evaluaciones.find(
                      (e) => e.criterio_id === criterio.id,
                    )?.estado ?? "pendiente_verificar"
                  }
                  onChange={(e) =>
                    void evaluar(
                      criterio.id,
                      e.target.value as EstadoEvaluacionDemo,
                    )
                  }
                >
                  {evaluaciones.map(([v, label]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
