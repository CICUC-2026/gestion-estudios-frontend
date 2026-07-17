import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Aplicacion } from './aplicacion/Aplicacion'
import './aplicacion/estilos.css'

const raiz = document.getElementById('root')

if (!raiz) {
  throw new Error('No se encontró el contenedor principal de la aplicación')
}

createRoot(raiz).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
)
