# Gestión de estudios clínicos — Frontend

Aplicación web de CICUC para gestión operativa y administrativa de estudios clínicos oncológicos.

## Inicio local

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

`VITE_API_URL` configura el prefijo de la API. Las rutas funcionales requieren una sesión válida y redirigen a `/ingresar`; el token opaco se conserva solamente en `sessionStorage` de la pestaña.

## Verificación

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Stack decidido

- React, TypeScript y Vite.
- React Router y TanStack Query.
- React Hook Form y Zod.
- Vitest y Playwright.

## Experiencia

- identidad visual propia de CICUC;
- barra horizontal superior como navegación principal;
- interfaz sobria, accesible y orientada a tablas y formularios;
- textos visibles en español;
- sin copiar estilos de otros productos;
- sin afirmaciones automáticas de elegibilidad.

Documentación y backlog: <https://github.com/CICUC-2026/gestion-estudios-documentacion>.
