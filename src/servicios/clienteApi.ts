const URL_API: string = import.meta.env.VITE_API_URL ?? '/api/v1'

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

export async function descargarApi(
  ruta: string,
  opciones: RequestInit,
  token?: string | null,
): Promise<{ archivo: Blob; nombre: string; hash: string }> {
  const encabezados = new Headers(opciones.headers)
  encabezados.set('Content-Type', 'application/json')
  if (token) encabezados.set('Authorization', `Bearer ${token}`)
  const respuesta = await fetch(`${URL_API}${ruta}`, { ...opciones, headers: encabezados })
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, 'EXPORTACION_FALLIDA', 'No fue posible generar la exportación.')
  const disposicion = respuesta.headers.get('Content-Disposition') ?? ''
  const nombre = disposicion.match(/filename="([^"]+)"/)?.[1] ?? 'cicuc-demo.dat'
  return { archivo: await respuesta.blob(), nombre, hash: respuesta.headers.get('X-Contenido-SHA256') ?? '' }
}
