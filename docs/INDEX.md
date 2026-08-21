# Documentación — MH Web 2.0

Mapa completo del repositorio, del producto y del despliegue. Escrito como base
para el rediseño: antes de tocar una línea de CSS, todo lo que existe hoy está
inventariado aquí.

| Documento | Qué contiene | Cuándo leerlo |
| --- | --- | --- |
| [PROJECT.md](./PROJECT.md) | Qué es el sitio, a quién le habla, objetivos de negocio, stack, scripts, decisiones de arquitectura | Primero. Contexto general |
| [FILEMAP.md](./FILEMAP.md) | Cada archivo del repo, línea por línea de responsabilidad, tamaños, quién importa a quién | Para ubicarte en el código |
| [MODULES.md](./MODULES.md) | Componentes React: props, estado, efectos, dependencias, árbol de render, hooks | Antes de modificar un componente |
| [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | Tokens, tipografía, color, escala, patrones visuales, animación. Estado actual y deuda | Antes de tocar `styles.css` |
| [CONTENT.md](./CONTENT.md) | Inventario de todo el copy y datos: secciones, textos, CTAs, casos, contacto | Para cambiar mensajes o estructura |
| [VERCEL.md](./VERCEL.md) | Proyectos, dominios, deploys, headers, caché, hallazgos de infraestructura | Antes de publicar |
| [SEO.md](./SEO.md) | Auditoría de indexación y Search Console: meta robots, duplicados, datos estructurados antes del JavaScript, sitemap | Cuando Google no enseña lo que debería |
| [AUDIT.md](./AUDIT.md) | Auditoría con severidad: rendimiento, accesibilidad, SEO, UX/conversión, código | Para saber qué está roto y qué duele |
| [REDESIGN.md](./REDESIGN.md) | Propuesta de rediseño: dirección visual, nueva arquitectura de página, sistema nuevo | El plan creativo |
| [ROADMAP.md](./ROADMAP.md) | Ejecución por fases, con criterios de aceptación y orden de trabajo | Para trabajar día a día |
| [CHANGELOG-REDESIGN.md](./CHANGELOG-REDESIGN.md) | **Qué cambió en el rediseño v3 y cómo volver atrás** | Estado actual del código |

> **Nota:** `FILEMAP`, `MODULES`, `DESIGN-SYSTEM` y `CONTENT` describen la
> versión **anterior** (guardada en `backup/v2.0-original`), que es la que se
> auditó. Para el estado posterior al rediseño, ver
> [CHANGELOG-REDESIGN.md](./CHANGELOG-REDESIGN.md).

## Estado del repositorio en el momento de este mapeo

- Rama de trabajo: `claude/website-audit-redesign-yqxavo`
- Último commit de producto: `3b2cfe5 feat: redesign MH Astral Systems flagship site`
- `npm run build` — pasa (12.4 s)
- `npm run lint` — pasa sin errores ni advertencias
- Producción (`https://www.mh-astral-systems.com`) sirve exactamente este HEAD
  (hashes `index-6bYaK80-.js` / `index-Cup_ShUC.css` verificados contra el build local)

## Cómo mantener esta documentación

Estos archivos describen el estado **actual**. Cuando el rediseño avance,
`FILEMAP.md`, `MODULES.md` y `DESIGN-SYSTEM.md` deben actualizarse en el mismo
commit que cambia el código. `AUDIT.md` se marca con ✅ conforme se resuelve cada
hallazgo, no se borra: sirve de historial.
