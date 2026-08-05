# PROJECT — MH Web 2.0

## 1. Qué es

Sitio insignia de **MH Astral Systems**, el estudio de Miguel Huerta Bautista
(Xochimilco, CDMX). No es un blog ni un e-commerce: es una **landing de una sola
página** cuyo único trabajo es convertir a un dueño de negocio en una
conversación por WhatsApp.

- Producto: diseño web + software a la medida (POS, CRM, automatizaciones)
- Mercado: negocios locales y PyMEs en Ciudad de México
- Idioma: español de México (`lang="es"`, `og:locale="es_MX"`)
- Modelo: servicio profesional 1 a 1, sin equipo, sin tickets, sin autoservicio

## 2. Objetivo de negocio

Un único objetivo medible: **mensajes de WhatsApp calificados**.

Toda la página existe para eso. Hay cuatro rutas hacia el mismo destino:

1. CTA del header (`Iniciar proyecto`)
2. CTA principal del hero (`Cuéntame tu proyecto`)
3. Botón flotante persistente (`Hablemos`)
4. Bloque de contacto al final (tarjeta grande de WhatsApp)

Todas apuntan a `https://wa.me/525523118153` con el mismo mensaje
pre-cargado. **No hay forma de distinguir cuál convirtió** — ver `AUDIT.md`.

Objetivo secundario declarado por el propio copy: transmitir que las dos
disciplinas (diseño visible + sistema detrás) vienen de la misma persona. Esa es
la diferenciación frente a una agencia o un freelancer de plantillas.

## 3. Audiencia

| Perfil | Qué busca | Qué lo detiene |
| --- | --- | --- |
| Dueño de negocio local (pastelería, salón de eventos, electrónica) | Que su negocio se vea profesional y que la operación deje de ser un caos de libretas y WhatsApp | Precio desconocido, miedo a "proyecto eterno", no sabe qué está comprando |
| Negocio con web pero sin sistema | Un POS/CRM que no sea un SaaS genérico | Duda de que una sola persona pueda con todo |
| Referido | Confirmar que el trabajo es real | Falta de pruebas verificables (enlaces a sitios en vivo) |

Consecuencia de diseño: el visitante llega en móvil, desde WhatsApp o
Instagram, con poca paciencia. El sitio actual pesa mucho y arranca con un
loader — ver `AUDIT.md` §Rendimiento.

## 4. Stack

| Capa | Tecnología | Versión | Nota |
| --- | --- | --- | --- |
| Runtime | React | ^18.3.1 | `StrictMode` activo, sin SSR |
| Build | Vite | ^6.0.5 (6.4.3 resuelto) | target `es2020` |
| 3D | three + @react-three/fiber + @react-three/drei | 0.185 / 8.18 / 9.122 | solo escena del hero, carga diferida |
| Animación | motion (Framer Motion v12) | ^12.42.2 | `motion/react` |
| Scroll | lenis | ^1.3.25 | scroll suave, se apaga con `prefers-reduced-motion` |
| Iconos | lucide-react | ^0.468.0 | importación por nombre (tree-shaking OK) |
| Tipografía | @fontsource-variable/manrope + syne | 5.2 / 5.3 | servidas localmente, **todos los subsets** |
| Estilos | CSS nativo | — | un solo archivo de 3 152 líneas |
| Lint | ESLint 9 flat config | ^9.17.0 | react-hooks + react-refresh |
| Hosting | Vercel (estático) | — | ver `VERCEL.md` |

**Lo que NO hay:** TypeScript, router, tests, CI, gestor de estado, CMS,
backend, base de datos, analítica, i18n, modo oscuro.

## 5. Scripts

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo Vite
npm run build    # build de producción → dist/
npm run preview  # sirve dist/ localmente
npm run lint     # eslint .
```

Salida de `npm run build` en el estado actual:

```
dist/index.html                    2.38 kB │ gzip:   0.97 kB
dist/assets/index-*.css           53.66 kB │ gzip:  14.22 kB
dist/assets/index-*.js           330.62 kB │ gzip: 105.68 kB
dist/assets/HeroScene-*.js       903.52 kB │ gzip: 244.64 kB   ← three.js
dist/assets/*.woff2              ~133 kB total (8 archivos, todos los subsets)
public/mh-logo-v2-1080.png       456 kB   ← sin optimizar
public/mh-logo-v2-720.png        232 kB   ← sin optimizar
```

Peso total de una primera visita en escritorio: **≈ 1.9 MB sin comprimir**.

## 6. Decisiones de arquitectura vigentes

1. **Una sola página, sin router.** Correcto para el alcance actual. Navegación
   por anclas (`#servicios`, `#trabajo`, `#proceso`, `#contacto`).
2. **Contenido en `src/data.js`.** Capacidades, proyectos y proceso viven en
   arreglos exportados. Los componentes iteran sobre ellos. Bien: el copy no está
   incrustado en JSX... salvo el del hero, manifiesto, encabezados de sección y
   contacto, que **sí** está incrustado. Inconsistente.
3. **CSS global sin módulos ni utilidades.** Un archivo, clases BEM-ish
   (`.hero__stage-top`, `.capability-deck__panel`). A 3 152 líneas ya es difícil
   de navegar y hay estilos que solo existen para maquetas decorativas.
4. **Degradación progresiva del 3D.** El hero detecta `prefers-reduced-motion`,
   ancho ≤ 640 px y disponibilidad de WebGL; si algo falla, muestra un PNG
   estático. Además hay un `ErrorBoundary` de clase (`WebGLBoundary`). Esta parte
   está bien resuelta.
5. **Loader propio bloqueante.** Espera fuentes + logo + `window.load`, con
   mínimo de 900 ms. Es una decisión de estilo que hoy cuesta métricas.
6. **Sin analítica.** Decisión implícita, no declarada. Impide optimizar.

## 7. Identidad de marca (estado actual)

- **Nombre:** MH Astral Systems · monograma "MH" · firma "MH97"
- **Tesis:** «Diseño que vende. Sistemas que ordenan.»
- **Tono:** directo, sin humo, anti-corporativo. Frases cortas, verbo en primera
  persona («Diseño lo que tus clientes ven»). Rechaza explícitamente testimonios
  y métricas inventadas (ver `.work__truth`).
- **Metáfora visual:** papel cálido + tinta mineral + acentos eléctricos, con
  cromo de máquina (tornillos, perillas, interruptores, lecturas de consola).
- **Paleta:** ver `DESIGN-SYSTEM.md`.

## 8. Riesgos actuales del proyecto

| Riesgo | Impacto |
| --- | --- |
| Cero analítica | No se sabe si la página convierte ni por dónde |
| Deploy manual por CLI, sin integración Git | Un `git push` no publica nada; el sitio y el repo pueden divergir |
| Dos proyectos Vercel para el mismo sitio | Confusión sobre cuál es la fuente de verdad |
| Casos sin enlace verificable | La prueba social más fuerte que existe está desaprovechada |
| Sin precios ni rangos | Fricción alta en el mercado objetivo |
| Bundle 3D de 903 kB | Riesgo de rebote en conexiones lentas |
