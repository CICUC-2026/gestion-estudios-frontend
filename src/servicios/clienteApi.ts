const URL_API: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

type ErrorServidor = {
  error?: {
    codigo?: string
    mensaje?: string
  }
}

export class ErrorApi extends Error {
  constructor(
    public readonly estado: number,
    public readonly codigo: string,
    mensaje: string,
  ) {
    super(mensaje)
  }
}

export async function solicitarApi<T>(
  ruta: string,
  opciones: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const encabezados = new Headers(opciones.headers)
  if (opciones.body && !encabezados.has('Content-Type')) {
    encabezados.set('Content-Type', 'application/json')
  }
  if (token) {
    encabezados.set('Authorization', `Bearer ${token}`)
  }

  const respuesta = await fetch(`${URL_API}${ruta}`, { ...opciones, headers: encabezados })
  if (!respuesta.ok) {
    let detalle: ErrorServidor = {}
    try {
      detalle = (await respuesta.json()) as ErrorServidor
    } catch {
      // El contrato público sigue siendo genérico si el servidor no devuelve JSON.
    }
    throw new ErrorApi(
      respuesta.status,
      detalle.error?.codigo ?? 'ERROR_INESPERADO',
      detalle.error?.mensaje ?? 'No fue posible completar la solicitud.',
    )
  }
  if (respuesta.status === 204) {
    return undefined as T
  }
  return (await respuesta.json()) as T
}
