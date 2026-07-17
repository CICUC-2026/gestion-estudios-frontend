import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useSesion } from '../dominios/autenticacion/sesionContexto'
import { ErrorApi } from '../servicios/clienteApi'

type EstadoNavegacion = {
  desde?: { pathname?: string }
}

export function PaginaIngreso() {
  const { usuario, cargando, ingresar } = useSesion()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const ubicacion = useLocation()
  const navegar = useNavigate()

  if (!cargando && usuario) {
    const estado = ubicacion.state as EstadoNavegacion | null
    return <Navigate replace to={estado?.desde?.pathname ?? '/'} />
  }

  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await ingresar(correo, contrasena)
      const estado = ubicacion.state as EstadoNavegacion | null
      await navegar(estado?.desde?.pathname ?? '/', { replace: true })
    } catch (causa) {
      setError(
        causa instanceof ErrorApi && causa.estado < 500
          ? causa.message
          : 'No fue posible iniciar sesión. Intente nuevamente.',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="pagina-ingreso">
      <section className="presentacion-ingreso" aria-label="Presentación CICUC">
        <a className="marca marca-ingreso" href="/ingresar" aria-label="CICUC">
          <span className="marca-simbolo" aria-hidden="true">C</span>
          <span>
            <strong>CICUC</strong>
            <small>Gestión de estudios</small>
          </span>
        </a>
        <div>
          <p className="sobrelinea sobrelinea-clara">Plataforma institucional</p>
          <h1>Información ordenada para decisiones humanas.</h1>
          <p>Gestión operativa y administrativa de estudios clínicos, con trazabilidad y control de acceso.</p>
        </div>
        <small>La plataforma no determina elegibilidad clínica.</small>
      </section>

      <section className="contenedor-formulario-ingreso">
        <form className="formulario-ingreso" onSubmit={(evento) => void enviar(evento)}>
          <div>
            <p className="sobrelinea">Acceso seguro</p>
            <h2>Iniciar sesión</h2>
            <p>Utilice la cuenta institucional creada por administración.</p>
          </div>

          {error ? <div className="mensaje-error" role="alert">{error}</div> : null}

          <label>
            Correo institucional
            <input
              autoComplete="username"
              disabled={enviando}
              onChange={(evento) => setCorreo(evento.target.value)}
              required
              type="email"
              value={correo}
            />
          </label>
          <label>
            Contraseña
            <input
              autoComplete="current-password"
              disabled={enviando}
              onChange={(evento) => setContrasena(evento.target.value)}
              required
              type="password"
              value={contrasena}
            />
          </label>
          <button className="boton-primario boton-ingreso" disabled={enviando} type="submit">
            {enviando ? 'Validando…' : 'Ingresar'}
          </button>
          <p className="ayuda-ingreso">Si no puede acceder, contacte a la administración de la plataforma.</p>
        </form>
      </section>
    </main>
  )
}
