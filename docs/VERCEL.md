# VERCEL — despliegue e infraestructura

Estado verificado el **5 de agosto de 2026** contra la API de Vercel y contra las
cabeceras HTTP reales de producción.

## 1. Cuenta y proyectos

**Equipo:** `MH Astral Systems` — `team_pSE0TmK8p4NCa4co6nf8XTGq`

Hay **19 proyectos** en el equipo. Dos corresponden al sitio de marca:

| Proyecto | ID | Framework | Último deploy | Dominios |
| --- | --- | --- | --- | --- |
| **`mh-web-2-0`** ← este repo | `prj_GfPmkma1Kc37Go4XPobOgtoind5Q` | **`null`** ⚠️ | `dpl_D5iYj4tVPMtKQ8peg6RUcVnTQRYj` (READY, producción) | `mh-web-2-0.vercel.app` + 2 alias de equipo |
| `mh-astral-systems` (sitio v1, obsoleto) | `prj_lwX5uCvSZwv4cgZiIeuAjAUuhPiV` | `vite` | `dpl_94cWPXzaAUMYXfgy5uhruRmHaTSZ` | `mh-astral-systems.com`, `www.mh-astral-systems.com`, `mh-astral-systems.vercel.app` |

Los otros 17 proyectos son trabajos de clientes, incluidos los cuatro casos que
la página presenta: `pasteleria-confetti`, `jardines-club-hipico`,
`fiesta-total-dj`, `electrotecnica-berlin-web`.

**Node:** 24.x en ambos proyectos.

## 2. Qué se sirve realmente hoy

Verificado por hash de assets:

| URL | Qué sirve |
| --- | --- |
| `https://www.mh-astral-systems.com/` | **Este repo, HEAD actual** (`index-6bYaK80-.js`, `index-Cup_ShUC.css`) |
| `https://mh-astral-systems.com/` | 308 → `www.` ✅ |
| `https://mh-web-2-0.vercel.app/` | El mismo build ✅ |
| `https://mh-astral-systems.vercel.app/` | ⚠️ **El sitio v1 antiguo** — otro código, con GSAP, Space Grotesk e IBM Plex, cargando fuentes desde Google Fonts |

### 🔴 Hallazgo: el sitio viejo sigue público e indexable

`mh-astral-systems.vercel.app` responde 200 con la versión anterior completa
(`<title>MH Astral Systems · Páginas web y sistemas que sí venden y organizan</title>`).
No tiene `robots.txt` propio: la petición devuelve el `index.html` por el
fallback de SPA, así que **los buscadores pueden rastrearlo e indexarlo**.

Consecuencias:
- Contenido duplicado compitiendo con el dominio real
- Un prospecto que llegue por ese enlace ve una versión que ya no representa el trabajo
- Confusión sobre cuál es la fuente de verdad

**Acción:** eliminar el proyecto `mh-astral-systems` o, si se quiere conservar
el historial, activar Deployment Protection en él para que deje de ser público.
El dominio ya apunta al build correcto, así que retirarlo no rompe nada — pero
**verificar primero a qué proyecto está asignado el dominio** antes de borrar.

## 3. 🔴 Hallazgo: nada se cachea

Cabeceras reales de producción:

```
GET /                              cache-control: public, max-age=0, must-revalidate
GET /assets/index-6bYaK80-.js      cache-control: public, max-age=0, must-revalidate   ← con hash
GET /assets/index-Cup_ShUC.css     cache-control: public, max-age=0, must-revalidate   ← con hash
GET /mh-logo-v2-1080.png           cache-control: public, max-age=0, must-revalidate   ← 456 KB
```

**Los assets con hash en el nombre deberían servirse con
`max-age=31536000, immutable`.** Al llevar hash, un cambio de contenido genera un
nombre nuevo: cachearlos para siempre es seguro por diseño.

Causa: el proyecto `mh-web-2-0` tiene `framework: null`, así que Vercel no aplica
el preset de Vite (que sí pondría `immutable` en `/assets/`), y **no existe
`vercel.json` en el repo** que lo corrija.

Coste medible por visita recurrente: 8 fuentes + JS + CSS + 2 PNG revalidados
contra el origen. En 4G eso son cientos de milisegundos regalados en cada
regreso al sitio.

## 4. 🟠 Hallazgo: sin integración con Git

Los 7 deploys del proyecto tienen `meta: {}` — sin `githubCommitSha`, sin rama,
sin autor de commit. Se crearon con **`vercel deploy` desde la CLI**.

Implicaciones:
- **`git push` a GitHub no publica nada.** El sitio y el repositorio pueden
  divergir en silencio
- No hay Preview Deployments por pull request
- No hay forma de saber, desde Vercel, qué commit está en producción
- Un rollback no se corresponde con un commit concreto

Todos los deploys los creó `huertabautistamiguel62@gmail.com`. La cuenta de
sesión actual es `enchuer2797@gmail.com` — conviene confirmar que ambas tienen
acceso al equipo.

## 5. 🟠 Hallazgo: sin cabeceras de seguridad

Presente (por defecto de Vercel):
```
strict-transport-security: max-age=63072000
```

Ausentes:
```
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=()
x-frame-options / frame-ancestors
```

Para un sitio estático sin formularios el riesgo es bajo, pero son cuatro líneas
en `vercel.json` y mejoran cualquier auditoría que un cliente corra sobre el
sitio del propio proveedor.

## 6. 🟠 Hallazgo: sin analítica

`package.json` no incluye `@vercel/analytics` ni `@vercel/speed-insights`, y no
hay Google Analytics ni ningún otro script de medición.

Hoy es imposible responder:
- ¿Cuánta gente visita el sitio?
- ¿Cuántos hacen clic en WhatsApp?
- ¿Cuál de los 4 CTAs convierte?
- ¿Cuánta gente abandona durante el loader?
- ¿Cuál es el LCP real en móviles mexicanos?

**Sin esto, el rediseño se evalúa por gusto, no por resultado.** Es la
recomendación de mayor retorno de todo este documento.

`@vercel/analytics` es gratis en el plan Hobby, pesa ~1 KB y se integra en dos
líneas. `@vercel/speed-insights` da Core Web Vitals de campo reales.

## 7. `vercel.json` propuesto

No existe. Este archivo resuelve los puntos 3 y 5 de una vez:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)\\.(png|jpg|jpeg|webp|avif|svg|ico|woff2)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
      ]
    }
  ]
}
```

Notas:
- `framework: "vite"` hace que Vercel aplique el preset correcto
- Si en el futuro se añaden rutas (router), habrá que agregar
  `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`.
  Hoy no hace falta: el sitio es de una sola página y `/ruta-inexistente`
  devuelve 404, que es el comportamiento correcto
- Los PNG del directorio `public/` no llevan hash. Marcarlos `immutable` obliga
  a renombrar el archivo cuando cambie el logo (`mh-logo-v3.png`). Es el
  compromiso estándar y vale la pena

## 8. Configuración recomendada en el panel de Vercel

Cosas que no se resuelven desde el repositorio:

1. **Conectar el repositorio de GitHub** a `mh-web-2-0` (Settings → Git). A
   partir de ahí cada push a `main` despliega y cada PR genera preview
2. **Confirmar la asignación del dominio.** La API lista
   `www.mh-astral-systems.com` bajo el proyecto `mh-astral-systems`, pero el
   contenido servido es el de `mh-web-2-0`. Dejar el dominio explícitamente en
   `mh-web-2-0` para eliminar la ambigüedad
3. **Retirar del aire el proyecto `mh-astral-systems`** (borrar o proteger)
4. **Activar Web Analytics y Speed Insights** (Settings → Analytics)
5. **Fijar la región de build** — irrelevante para el runtime, el contenido es
   estático y se sirve desde toda la red CDN

## 9. Checklist previo a cada publicación

```bash
npm run lint        # debe pasar limpio
npm run build       # revisar tamaños de chunk
npm run preview     # verificar en local antes de subir
```

Y comprobar:
- [ ] El titular del hero se lee completo a 360 px de ancho
- [ ] El botón flotante de WhatsApp no tapa el CTA de contacto en móvil
- [ ] El hero degrada bien con `prefers-reduced-motion` activado
- [ ] `og:image` se ve correctamente en el validador de WhatsApp
- [ ] El enlace de salto (`skip link`) lleva al contenido con Tab

## 10. Resumen de hallazgos de infraestructura

| # | Hallazgo | Severidad | Arreglo |
| --- | --- | --- | --- |
| V1 | Assets con hash sin caché (`max-age=0`) | 🔴 Alta | `vercel.json` |
| V2 | Sitio v1 antiguo público e indexable | 🔴 Alta | Borrar o proteger el proyecto |
| V3 | Sin analítica de ningún tipo | 🔴 Alta | `@vercel/analytics` + `speed-insights` |
| V4 | Sin integración Git — `git push` no despliega | 🟠 Media | Conectar repo en el panel |
| V5 | `framework: null` en el proyecto | 🟠 Media | `vercel.json` |
| V6 | Sin cabeceras de seguridad | 🟠 Media | `vercel.json` |
| V7 | Dominio asignado a un proyecto y sirviendo otro | 🟠 Media | Reasignar en el panel |
| V8 | Sin `.env.example` ni variables documentadas | 🟡 Baja | Crear el archivo |
