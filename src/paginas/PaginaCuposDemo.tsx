import { useEffect, useState } from "react";

import {
  cambiarCupoDemo,
  confirmarCupoDemo,
  obtenerCuposDemo,
  type CupoDemo,
  type EstadoCupoDemo,
} from "../dominios/cupos/apiCupos";
import { obtenerEstudios } from "../dominios/estudios/apiEstudios";
import type { Estudio } from "../dominios/estudios/tipos";
import {
  obtenerPacientesDemo,
  type PacienteDemo,
} from "../dominios/pacientes/apiPacientes";

const nombres: Record<EstadoCupoDemo, string> = {
  confirmado: "Confirmado disponible",
  reservado: "Reservado",
  ocupado: "Ocupado",
  pendiente_reconfirmacion: "Pendiente de reconfirmación",
  cancelado: "Cancelado",
};

export function PaginaCuposDemo() {
  const [items, setItems] = useState<CupoDemo[]>([]);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [pacientes, setPacientes] = useState<PacienteDemo[]>([]);
  const [estudioId, setEstudioId] = useState("");
  const [fuente, setFuente] = useState("Confirmación ficticia del patrocinador");
  const [dias, setDias] = useState(30);
  const [pacientePorCupo, setPacientePorCupo] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    const [cupos, inventario, casos] = await Promise.all([
      obtenerCuposDemo(),
      obtenerEstudios(),
      obtenerPacientesDemo(),
    ]);
    setItems(cupos);
    setEstudios(inventario);
    setPacientes(casos.filter((p) => !p.archivado));
    setEstudioId((actual) => actual || inventario[0]?.id || "");
  }
  useEffect(() => {
    void Promise.all([obtenerCuposDemo(), obtenerEstudios(), obtenerPacientesDemo()])
      .then(([cupos, inventario, casos]) => {
        setItems(cupos);
        setEstudios(inventario);
        setPacientes(casos.filter((p) => !p.archivado));
        setEstudioId(inventario[0]?.id ?? "");
      })
      .catch(() => setMensaje("No fue posible cargar los cupos sintéticos."));
  }, []);

  async function confirmar(evento: React.FormEvent) {
    evento.preventDefault();
    await confirmarCupoDemo({
      estudio_id: estudioId,
      fuente,
      dias_validez: dias,
      motivo: "Disponibilidad confirmada para demostración",
    });
    await cargar();
    setMensaje("Cupo confirmado y auditado.");
  }

  async function cambiar(item: CupoDemo, estado: EstadoCupoDemo) {
    const pacienteId = pacientePorCupo[item.id] || item.paciente_id || pacientes[0]?.id;
    await cambiarCupoDemo(item.id, {
      estado,
      paciente_id: estado === "reservado" ? pacienteId : undefined,
      dias_validez:
        estado === "confirmado" || estado === "reservado" ? dias : undefined,
      motivo: `Cambio manual a ${nombres[estado]}`,
    });
    await cargar();
    setMensaje("Cambio guardado con su motivo e historial.");
  }

  return (
    <>
      <section className="encabezado-pagina">
        <div>
          <p className="sobrelinea">Disponibilidad administrativa · Demo</p>
          <h1>Cupos y reservas sintéticas</h1>
          <p>Confirma, reserva y reconfirma sin representar decisiones clínicas.</p>
        </div>
      </section>
      <aside className="aviso-prototipo">
        <strong>Vigencia controlada</strong>
        <span>Se avisa siete días antes; al vencer se conserva la asignación y se exige reconfirmar.</span>
      </aside>
      {mensaje ? <p className="mensaje-accion-demo" role="status">{mensaje}</p> : null}
      <form className="formulario-paciente-demo" onSubmit={(e) => void confirmar(e)}>
        <label>
          Estudio
          <select value={estudioId} onChange={(e) => setEstudioId(e.target.value)}>
            {estudios.map((estudio) => <option key={estudio.id} value={estudio.id}>{estudio.codigo_interno}</option>)}
          </select>
        </label>
        <label>
          Fuente
          <input value={fuente} onChange={(e) => setFuente(e.target.value)} required />
        </label>
        <label>
          Vigencia (15–90 días)
          <input type="number" min="15" max="90" value={dias} onChange={(e) => setDias(Number(e.target.value))} />
        </label>
        <button className="boton-primario" type="submit">Confirmar cupo</button>
      </form>
      <section className="panel-tabla">
        <div className="cabecera-tabla"><h2>Cupos persistentes</h2><span>{items.length} registros</span></div>
        <div className="tabla-desplazable">
          <table>
            <thead><tr><th>Estudio</th><th>Estado</th><th>Paciente</th><th>Vigencia</th><th>Acciones</th></tr></thead>
            <tbody>{items.map((item) => (
              <tr key={item.id}>
                <td>{estudios.find((e) => e.id === item.estudio_id)?.codigo_interno}</td>
                <td>{nombres[item.estado]}{item.vence_pronto ? " · vence pronto" : ""}</td>
                <td>
                  {item.paciente_id ? pacientes.find((p) => p.id === item.paciente_id)?.codigo : (
                    <select aria-label="Paciente sintético para reserva" value={pacientePorCupo[item.id] || pacientes[0]?.id || ""} onChange={(e) => setPacientePorCupo((v) => ({ ...v, [item.id]: e.target.value }))}>
                      {pacientes.map((p) => <option key={p.id} value={p.id}>{p.codigo}</option>)}
                    </select>
                  )}
                </td>
                <td>{new Date(item.vence_en).toLocaleDateString("es-CL")}</td>
                <td>
                  {item.estado === "confirmado" ? <button type="button" onClick={() => void cambiar(item, "reservado")}>Reservar</button> : null}
                  {item.estado === "reservado" ? <button type="button" onClick={() => void cambiar(item, "ocupado")}>Marcar ocupado</button> : null}
                  {item.estado === "pendiente_reconfirmacion" ? <button type="button" onClick={() => void cambiar(item, item.paciente_id ? "reservado" : "confirmado")}>Reconfirmar</button> : null}
                  {!['cancelado'].includes(item.estado) ? <button type="button" onClick={() => void cambiar(item, "cancelado")}>Cancelar</button> : null}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}
