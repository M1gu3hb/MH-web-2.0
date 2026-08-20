# Investigación para el rediseño de Morphiq

> Documento de trabajo del rediseño multipágina. Recoge qué se miró, qué se
> aprendió y qué decisiones salieron de ahí. No es un informe para el
> cliente: es la memoria de por qué el sitio está hecho como está.

**Método.** Ocho frentes de investigación en paralelo, cada uno visitando
sitios reales y documentación de primera parte, no blogs de SEO. Fecha:
agosto de 2026.

- **113 sitios** visitados de verdad (no descritos de memoria).
- Frentes: agencias mexicanas, estudios premium internacionales, empresas de
  POS y CRM en Latam, presentación de precios, soluciones para restaurantes,
  SEO técnico, responsive y rendimiento, CRO y formularios.
- Para SEO, responsive y rendimiento se usó **Google Search Central y
  web.dev** como fuente principal, con la URL citada en cada punto.

---

## Sitios analizados

Los más relevantes, con lo que se aprendió de cada uno.

### BluePixel
<https://www.bluepixel.mx/es/inicio>

Enterprise en CDMX, el extremo opuesto a Morphiq. Hero: 'Construimos, evolucionamos y agentizamos plataformas digitales' con CTAs 'Explora nuestro modelo' / 'Habla con nuestro equipo'. Nav de 7 items con tres dropdowns (Servicios, Especialidades, Industrias) — sin Precios. Cero precios en todo el sitio; en cambio el formulario de contacto pide nombre, empresa, correo corporativo, puesto, tipo de proyecto y un dropdown de presupuesto que arranca en 300,000-800,000 MXN y llega a 5M+. Lo único estructuralmente interesante de toda la muestra: separan por modelo de relación (BUILD = plataforma nueva, MVP, 3 meses; EVOLVE = mejora continua con roadmaps de 6/12/24 meses y rendición de cuentas trimestral) en lugar de por entregable. Los casos de éxito están anonimizados ('Global consumer brand', 'LATAM loyalty program'), lo que anula gran parte de su valor como prueba. Su /desarrollo-web apila 13 secciones incluyendo un FAQ de 20+ preguntas.

### Syllet
<https://www.syllet.com/>

El análogo más cercano a Morphiq de toda la muestra: mismo mix de web + punto de venta + ERP, ya multipágina. Home corta y limpia (hero, tres tarjetas de servicio, beneficios, CTA, footer) con 'desde $' visible: Páginas Web desde 3,500, Puntos de Venta desde 1,500, ERP a cotización. Nav de 5 items sin Precios. El error a no copiar: su hub /servicios muestra las tres tarjetas SIN un solo precio y obliga a un clic más; los precios reales solo aparecen en la página de detalle. Ahí sí acierta: /servicios/paginas-web tiene una tabla comparativa de 5 tiers (Landing 3,500 / Básica 6,000 / Profesional 12,000 / E-commerce Pequeño 20,000 / E-commerce Grande 35,000), cada uno con inclusiones, 2 rondas de revisión y plazo de entrega (2-30 días). Ningún costo recurrente: 'hosting y dominio incluidos el primer año' y el año 2 sin número. Cero testimoniales. En su blog sí desglosa POS: 1,500 solo software / 8,000 con hardware.

### Desarrollo de Páginas Web México (Software Web y Apps)
<https://www.desarrollodepaginasweb.com.mx/precios-de-paginas-web-en-mexico/>

El único de los 7 con PRECIOS en la navegación principal, y la tabla más honesta de la muestra: seis tiers con precio fijo (no 'desde') escalados por número de secciones — Económico 4,800 (2 secciones), Emprendedor 6,800 (4), Negocios 8,800 (6), Microempresa 10,800 (8), PyME 12,800 (10), Empresarial 14,800 (12) — todos con SSL, hosting y dominio a 12 meses y plazo de 5-14 días hábiles. Nombrar los tiers por tamaño de empresa ('Microempresa', 'PyME') es más útil para el comprador que 'Básico/Pro/Premium'. Puntos débiles: escalar el precio por conteo de secciones convierte la venta en una discusión de cantidad, no de resultado; la renovación aparece como 'Pago de Renovación' sin cifra; la prueba es '4.7 basado en 22 reseñas' y el hero es un H1 de keywords en mayúsculas ('DISEÑO DE PÁGINAS WEB EN MÉXICO, DESARROLLO WEB CDMX').

### Páginas Web para PyMEs
<https://paginaswebparapymes.com/>

Competidor directo del tier de 2,000 MXN de Morphiq, y conviene mirarlo con cuidado por eso. Es una sola página larga cuya navegación tiene exactamente un item: 'Contacto'. H1 con emojis: 'DISEÑO DE PÁGINAS WEB ECONÓMICAS Y BARATAS EN CDMX'. Vende con descuento tachado: Presencia Web Básica 2,600 → 2,000 (una página, 3 correos, SSL, formulario, botón de WhatsApp, hosting y dominio 1 año); Web Profesional 4,800 → 3,000 (tres páginas, 5 correos, mapa); Presencia web sólida 6,000 → 4,500 (cinco páginas, 10 correos). Número de WhatsApp a la vista (5625082601). Es el piso del mercado: compite por precio y por la palabra 'barato', sin caso de éxito ni proceso. Morphiq no debería pelear en ese eje con el mismo número.

### Creative Studio
<https://www.creativstudio.com.mx/desarrollo-web-profesional>

Rango medio en CDMX, 18 años. El único hero con una promesa falsable de la muestra: 'Sitios web que generan ventas, no solo visitas', CTA 'Quiero mi cotización gratuita'. Publica precios pero los entierra en prosa y NO tiene página de precios en el menú: sitio corporativo desde 12,500 hasta 35,000, e-commerce desde 20,000 (50-100 productos), landing desde 4,500, aplicaciones web a medida desde 45,000. Servicios separados por disciplina de marketing (SEO, Google Ads, Social Media, Diseño Gráfico, Fotografía de Producto), no por problema de negocio. Dos cosas a robar: testimoniales con nombre real de cliente (Hospital Ángeles Lomas) en vez de contadores anónimos, y una matriz comparativa 'agencia vs freelancer vs plantillas' — que es literalmente un ataque a la posición de Morphiq y hay que responder de frente. A cambio, la página apila 14 secciones incluyendo miedo puro ('el costo de no tener presencia profesional').

### New Emage
<https://newemage.com.mx/>

Agencia grande y vieja (19 años, dos oficinas). Hero genérico e intercambiable: 'Agencia de Diseño Web en México' / 'Hagamos crecer tu empresa en internet', CTAs 'Iniciar Proyecto' y 'Ver proyectos'. Nav de solo 4 items donde el último es 'Cotizar' — el precio no se publica, se sustituye por un 'cotizador de páginas web' interactivo y por botones 'Cotiza Aquí' repetidos. Toda su estrategia de confianza es badge externo: estrellas de Sortlist, Trustpilot, Clutch y Google Partner justo debajo del hero, más '1,650 proyectos / 19 años / 95% satisfacción'. Clientes con nombre (World Vision, USDA México) que Morphiq no puede igualar. Sin WhatsApp visible, con tres correos de ventas distintos — fricción alta para un comprador PyME.

### Magokoro
<https://www.magokoro.mx/>

Estudio en San Luis Potosí, no CDMX, posicionado en IA: 'Transformamos empresas implementando IA, creando productos y acelerando el crecimiento digital'. Cero precios en el sitio pese a que su blog publica un artículo entero de 'precios reales' de desarrollo web en México — usan el contenido de precios como imán de tráfico y luego no cotizan nada, lo que rompe la promesa del artículo. Servicios en tres bloques (Desarrollo de Apps, Software a la Medida, IA & Data). Lo único que vale copiar: su CTA principal es 'Agendar' con link de calendario — es el único de los 7 que deja al prospecto reservar una llamada solo, y nadie en el rango PyME lo ofrece.

### ListoWeb (no cargó)
<https://listoweb.com.mx/precios-de-paginas-web/>

NO CARGÓ: dos intentos de fetch (home y /precios-de-paginas-web/) devolvieron contenido vacío, probablemente bloqueo al fetcher. No pude verificar nada de primera mano, así que no lo cuento como sitio analizado. Relevante solo como señal: aparece primero en la búsqueda de 'precios de páginas web México' y se presenta como comparador de precios entre proveedores. Que exista un marketplace de comparación posicionado arriba de las propias agencias confirma que el comprador PyME mexicano llega buscando precio explícito — argumento a favor de que Morphiq lo publique en vez de esconderlo tras 'cotiza gratis'.

### Clay
<https://clay.global/>

Hero literal y sin CTA: 'Clay is a global branding and UX design agency' (animado palabra por palabra) + 'We build transformative digital experiences for the world's leading brands by blending AI, design, and technology.' No hay ningún botón en el hero; la única vía es 'Contact' en el nav. Separa 'Work' de 'Clients' en la navegación: /work son ~13 casos con imágenes, /clients es una lista plana de ~30 clientes donde cada uno es UNA frase de lo que hicieron exactamente ('Cisco — Web design, content, and development for Meraki Go'; 'Amazon — Product design collaboration with Amazon's innovation teams. Confidential.'). Admitir la confidencialidad en vez de inflar es lo más honesto del sitio. En /about solo publican números CONTABLES: '78 Global Team Members', '16 Years In Business', '529 Projects Completed' — cero porcentajes de desempeño. Testimonios siempre con nombre, puesto y empresa (Hanna Byers, VP of Product, Wealth). El caso de Slack (clay.global/work/slack) no tiene NI UNA métrica, ni testimonio, ni créditos: solo secciones nombradas por decisión de diseño ('Audience Appeal', 'Optimized for Every Screen', 'Localization') y cierra con 'Let's Talk' + correo + teléfono. El fundador nunca se nombra; aparece solo como garantía operativa en el FAQ: 'our cofounders oversee every project, while a design director leads the way'. Crítica: el home termina con ~2,000 palabras de FAQ que es claramente relleno de SEO (incluye ligas a sus propios rankings de blog 'Top Branding Agencies', o sea se autoclasifican); 'Generative AI' como sexto servicio se lee a moda; y su /contact no tiene formulario, solo hey@clay.global y un teléfono.

### Work & Co
<https://www.work.co/>

El mejor manual de 'métricas sin inventar'. El hero dice 'We solve complex problems through design & technology' e inmediatamente cede la palabra a un tercero: '"Entrusted with digital product innovation by companies like Apple, Google, Nike." — Fast Company'. No hay barra de navegación tradicional: un 'Index' con Select Clients / Practice Areas / Outcomes / Process / Leadership / News & Insights / Careers. Que 'Outcomes', 'Process' y 'Leadership' sean páginas de primer nivel es una decisión de IA deliberada: son las tres objeciones de venta. En /outcomes hay ~18 cifras y CADA UNA está pegada a un cliente con nombre y a un hecho público verificable: '680M Dollars in revenue for the Epic Games Store in year one', 'No 1 — Virgin America's peak rank in the App Store and Google Play', '4.9 App store rating for Equinox', 'Half — the amount of time required to check in on the new Aeromexico website'. En /process no hay métricas sino 9 compromisos de conducta con nombre propio: 'Small, senior teams', 'Technology from day one', '20 days to market feedback', 'Zero big reveals', 'Fully dedicated staffing'. El caso de Aesop (/clients/aesop/) abre con el alcance en verbos ('Global rollout to 43 countries with localization support', 'Training for Aesop designers and developers during handoff'), luego 'Outcomes' con solo DOS números acotados en el tiempo ('2 Weeks from kickoff to prototype', '15% Higher conversion within 60 days of launching'), después 'Awards & Recognition' con ligas externas ('Read more') y '3 Big Takeaways' numerados 01/02/03; cierra con 'More Case Studies', sin CTA duro. Nota: la URL es /clients/aesop/, no /work/ — encuadran todo como relación, no como pieza. Crítica: el formulario pide 7 campos (empresa, puesto, ubicación, 'How did you hear about us?'), calificación pesada apropiada para enterprise y letal para una PyME; /leadership queda prácticamente vacía sin JS; y el sitio ya es de Accenture (los avisos legales apuntan a accenture.com) sin decirlo en ninguna parte visible.

### Bakken & Bæck
<https://bakkenbaeck.com/>

El hero ES la definición: 'Bakken & Bæck is a design and technology studio. We build digital products, from zero to launch.' — el nombre va dentro de la oración. Nav de 6: Work / About / Clients / Join us / A–Z / Get in touch (botón persistente, más un correo con botón de copiar). 'A–Z' es un glosario navegable de ~38 entradas de cultura (accessibility, independence, mental-health, parental-kit, zig-zag): toda la personalidad vive ahí y las páginas de trabajo quedan sobrias. El índice de trabajo es puramente visual: nombre + etiquetas (Brand / Web / Product) + 3-4 imágenes, sin descripciones ni cifras. El caso de Sierra (/case/sierra) titula con una oración completa de lo que hicieron, no tiene ninguna métrica ni testimonio, pero acredita por nombre a colaboradores EXTERNOS (Logo: Ben Barry; Film/Photo: Osma Harvilahti, Guillem Cruells...; Sound: Plan8) y publica el stack (React, Next.js, Tailwind, Framer Motion). Las capacidades se presentan en tres columnas —Strategy / Design / Code— con ~12 entregables concretos cada una (Tone of Voice, Sitemaps, Design Systems, CMS Implementation, QA, Infrastructure + DevOps), no como categorías vagas. El /about se apoya en hechos verificables: '60+ employees across 5 offices', fundado en 2011, '100% independent', 'owned by the same people who started it in 2011'. Un solo testimonio en el home, con nombre y cargo: '— Clay Bavor, co-founder of Sierra'. Crítica: siendo un estudio de fundadores-dueños, no nombra ni muestra a un solo fundador en /about — se pierden la carta más fuerte que tienen; y '500+ clients' es el número menos verificable y menos útil que publican.

### Locomotive
<https://www.locomotive.ca/en>

El modelo más transferible a un estudio pequeño. Nav de 5: Work / Agency / Careers / Store / Let's talk, con 'Let's talk' siempre visible ('Store' vende playeras y gorras de 25-30 USD: personalidad como extensión de marca). El hero es una construcción animada de posicionamiento + geografía: 'Digital-First Design Agency / Based in Montreal, Canada', nada más. La credibilidad se construye con PERSONAS: en /agency listan al equipo completo agrupado por disciplina con headcount ('01 Design — 9 people', '02 Development — 11 people') y cada persona con nombre, rol y AÑO DE ENTRADA ('Frédéric Marchand — Co-founder / President — 2008'; 'Mathieu Ducharme — Partner / Technical Director — 2008'). La historia de origen es concreta, no épica: 'It's been that way since our three founders—an ops guy, a designer and a dev—started the agency back in 2008.' El caso de Lightship (/en/work/lightship) es la mejor plantilla que vi: metadatos arriba (©2023, Technology, San Francisco USA), frase-tesis ('Moving road trips to the electric age.'), la URL EN VIVO del sitio, un párrafo 'About' que NOMBRA a la agencia colaboradora (Manual) y aclara qué aportó ella, 'Awards (2)' atribuidos al organismo ('Site of the Day — Awwwards', 'Developer award — Awwwards') y 'Credits' con cada persona por nombre y rol, incluidos los tres front-end devs y el PM. Crítica: en el home aparece 'Seven Years Running / 2018-2024 / The dynasty' sin nombrar ni ligar al organismo que otorga ese ranking — es la única afirmación no atribuida del sitio y desentona; y la frase 'Over the past 15 years, Locomotive® has become a go-to for meaningful, innovative, results-driven digital experiences. Freshness guaranteed.' es exactamente el relleno de marketing que el resto del sitio evita. El uso masivo de emojis es una apuesta de gusto que no todos los prospectos van a leer como confianza.

### Metalab
<https://metalab.com/>

Hero de tres palabras: 'We make interfaces', con subtítulo 'Since 2006, we've helped the most innovative startups and reputable brands design, build, and ship products worth talking about.' La única credibilidad que se permiten en el hero es una fecha. El índice de trabajo (/work) usa filtros por segmento —Startup, Leader, AI, Ecommerce, Finance, Health & Wellness, Productivity, SaaS, Media— para que el visitante se autoseleccione; cada entrada es una frase de alcance + etiquetas de servicio (Product Design, Brand, Website, iOS App, Frontend Engineering) y solo algunas llevan 'View case study' (una dice 'Archive case study'): no fingen que todo proyecto tiene caso. Bajo NDA describen sin nombrar en vez de inventar: 'Crafting the original interface for the world's leading prompt-to-image AI service.' El caso de Headspace es sorprendentemente escueto: metadatos 'Project Type / Stage / Deliverables' (Web / Startup / Web Design, Motion Framework, UI Design) e imágenes; ni métricas, ni testimonio, ni créditos. El /about no vende: es un mapa de ciudades del equipo y las vacantes abiertas — nada de fundadores ni fotos de liderazgo. Crítica seria y muy relevante para Morphiq: el HTML servido del home contiene ÚNICAMENTE la frase del hero y un solo enlace (href='/'); navegación, portafolio y contenido de casos son 100% client-side. Es pésimo para SEO y frágil, y un estudio que depende de búsquedas locales no puede copiar ese enfoque técnico.

### BASIC/DEPT
<https://basicagency.com/>

Lo incluyo porque resuelve mejor que nadie el problema de 'números con fuente'. Su 'Agency Snapshot' son seis fichas donde cada cifra carga su origen: 'People 120+', 'Years 10', 'Growth 168% — As Adweek's 18th fastest growing agency', 'Ranking 01 — Within the mobile and website related categories, no other agency has been recognized by the Webby Awards more than us the past four years', 'Global Reach 28 — As part of Dept, we have 28 offices and 1,500+ people'. Los premios se citan con el título literal del organismo ('Design and Branding Agency of the Year', 'Digital Innovation Agency of the Year Finalist'), no parafraseados. La sección 'Featured Engagements' es otro tipo de prueba: en vez de un caso, un párrafo que describe la NATURALEZA de la relación ('Our embedded partnership with Google is as deep as it gets. We're the lead creative agency for Google Store'). La personalidad está confinada a 'Initiatives' (playlist, podcast, serie de charlas), fuera de las páginas de trabajo. Crítica: el home arranca con un 'Watch Reel' a pantalla completa que retrasa cualquier información útil, y la frase de posicionamiento 'turn cultural values into company value' es abstracta al punto de no decir qué venden; un comprador de PyME se perdería en los primeros diez segundos.

### Alegra México (precios y punto de venta)
<https://www.alegra.com/mexico/precios/>

Publica todo: cuatro niveles (Emprendedor/Pyme/Pro/Plus) por cada módulo — Facturación desde MXN 138/mes, POS desde MXN 199/mes, Contabilidad desde MXN 499/mes — con el precio mensual tachado junto al anual y el descuento explícito (25%). Marca 'Pyme' como Recomendado en la posición 2 de 4. La objeción de compromiso se resuelve en una sola línea bajo el precio: 'Prueba gratis 15 días, sin tarjeta | Sin contrato de permanencia'. La página de POS nunca define qué es un punto de venta; abre con el resultado ('Vende y factura en segundos') y ataca objeciones concretas en una FAQ de 20+ preguntas: hardware ('usa tus propios equipos'), internet (app de escritorio que vende offline y sincroniza), SAT ('válido ante el SAT', PAC integrado). El lado malo: 4 productos × 4 planes = 16 SKUs; para un negocio que no sabe si necesita contabilidad o solo POS, la página de precios es un examen. Morphiq no debe imitar esa complejidad.

### Bsale México
<https://www.bsale.com.mx/sheet/precios>

El modelo más copiable para Morphiq. Tres planes con precio en MXN e IVA incluido (Básico $860, Estándar $1,060, Full $1,660), rotulados por tipo de negocio y no por features: 'ideal para empresas de servicios' / 'para empresas que venden productos' / 'para los que venden en muchos canales'. Los extras están publicados en la misma tabla en vez de escondidos: CFDI adicionales +$192/mes, sucursal adicional +$640/mes, almacén $320/mes. El hero es una pregunta de calificación directa ('¿Vendes productos y necesitas un sistema de ventas?') y promete 'acompañamiento personalizado para negocios en México'. La FAQ es su mejor activo: responde con un no cuando toca ('¿Bsale incluye equipos? No. Bsale únicamente ofrece el Software'), da portabilidad de salida ('tus datos quedarán disponibles para descargar durante 30 días'), niega la permanencia ('no te exige amarrarte a contratos de largo plazo') y — lo más valioso — pone un SLA de implementación: 'plazo máximo de 30 días para configurar y dejar operativo el sistema'. Prueba social con cifras no redondeadas (12,132 empresas, 113,398 usuarios, 52,204 sucursales) más sellos ISO 27001 y AWS.

### Loyverse TPV
<https://www.loyverse.com/en-us/pricing>

Rompe el esquema de planes: el POS es gratis para siempre y se cobran módulos sueltos por tienda — historial ilimitado $5/mes, gestión de empleados $25/mes, inventario avanzado $25/mes (con ~17% de descuento anual). Cada add-on trae su propia prueba de 14 días. La objeción de compromiso se ataca con una frase seca y repetida: 'No contracts, no cancellation fees, no monthly minimums', más 'no credit card required' para abrir cuenta y alta/baja de tiendas cuando quieras. Cobra aparte el procesamiento (2.6% + 15¢) y hardware opcional de $59 a $269. Lo relevante para Morphiq: al facturar por tienda y no por usuario, el precio escala con el tamaño real del negocio y el dueño de un solo local nunca siente que está subsidiando funciones que no usa. El riesgo del modelo es que el 'gratis' entrena al cliente a no pagar; Loyverse lo compensa cobrando en la transacción, algo que Morphiq no puede hacer.

### Zoho CRM en español
<https://www.zoho.com/es-xl/crm/what-is-crm.html>

Ejemplo limpio de separar educación de venta. La definición para no técnicos vive en una URL aparte que abre traduciendo la sigla ('CRM significa gestión de relaciones con clientes') y luego usa una analogía de panadería con miles de pedidos diarios llegando por web, app y redes sociales; recién al final salta al producto ('el software de CRM favorito del mundo'). La página de producto no repite nada de eso. En precios: cuatro ediciones por usuario/mes con 'ahorra hasta un 34%' anual y edición gratuita de hasta tres usuarios; las objeciones se atacan con literales fuertes — 'No estás atado a ningún contrato ni compromiso', 'servicio de pago por uso (mensual o anual)' — y la implementación se vende como servicio profesional aparte ('desde la recopilación de requisitos hasta la configuración y la incorporación'), no como cargo oculto. Falla concreta y aleccionadora: la URL en español me sirvió precios en rupias indias (₹800/usuario/mes) por geodetección. Si Morphiq automatiza moneda, un prospecto de CDMX puede ver dólares.

### Clip
<https://www.clip.mx/como-funciona-clip>

Vende hardware + comisión, no mensualidad, y toda la página está construida alrededor de lo que NO pagas: titular 'Sin cuotas mensuales', 'sin rentas', 'sin mínimos de venta', 'en 5 minutos, sin RFC ni trámites complicados'. La comisión (3.6% + IVA en el sitio general, 2.99% + $1 en Clip Total 3) no encabeza la página: aparece dentro de la lista de beneficios, después de haber resuelto las objeciones de depósito ('recibe tu dinero de inmediato', incluso en días festivos) y de trámite. El proceso se explica en 3 pasos de usuario (descarga, registra, configura) antes de los 6 pasos técnicos del cobro. En la ficha de producto el precio se ancla brutalmente ($4,499 tachado → $699, -84%) y se fracciona en 12 MSI de $58, con 'garantía ilimitada'. Es el manual de cómo hacer digerible un costo de entrada — exactamente el problema de Morphiq con su cargo de implementación.

### Bind ERP (no accesible)
<https://bind.com.mx/precios>

No pude verificar nada de primera mano: bind.com.mx devuelve una pantalla de verificación anti-bot ('Bot Verification: Verifying that you are not a robot') tanto en /precios como en la raíz, y su centro de ayuda solo redirige a esa misma página. Lo único documentado por terceros y por su propio material de ayuda: planes trimestrales o anuales en un rango aproximado de $570 a $1,700 MXN/mes según plazo (+Control y +Crecimiento como nombres de plan), un mes de capacitación sin costo al contratar, y la promesa de que 'no hay costos extras por módulos'. Trato esto como referencia indirecta, no como observación verificada. Vale registrar el patrón de todos modos: el competidor mexicano más cercano al modelo de Morphiq regala la capacitación de arranque y presume no cobrar por módulos — dos cosas que hacen más difícil defender un cargo de implementación separado.

### NN/g — Pricing information gives B2B sites a competitive advantage
<https://www.nngroup.com/articles/show-price/>

Hallazgo central: el precio es "the top most needed piece of information online" para compradores B2B, y en sus estudios los participantes abandonaron sitios sin precio para irse a competidores que sí lo mostraban. Cuando el precio exacto no es viable recomiendan tres salidas: precios de muestra, rangos, o precio de referencia. Advertencia explícita contra calculadoras: "most pricing tools proved complex, time-consuming, and error prone". No cita porcentajes, es investigación cualitativa.

### NN/g — Show Prices for Common Scenarios
<https://www.nngroup.com/articles/show-prices-for-common-scenarios/>

La guía más accionable para Morphiq: "if you can't show exact prices or your price list is extremely complicated, offer users some representative cases and their prices". El insight clave es que el prospecto en fase de investigación solo necesita "a general idea of cost levels" para armar su lista corta, no una cotización exacta. Prefieren una tabla simple con los casos más comunes por encima de un configurador.

### NN/g — What B2B Designers Can Learn from B2C About Building Trust
<https://www.nngroup.com/articles/b2b-trust-from-b2c/>

Regla textual: "Show the price; and if the price is variable, offer common pricing scenarios". Enumera tres daños de esconder el precio: fricción extra, hace parecer el servicio incosteable, y "makes the organization seem dubious for the simple reason that it is hiding something". Sobre formularios: dar una razón para cada dato que pides ("We ask for your postal code to determine service availability") aumenta el cumplimiento, citando Langer & Chanowitz 1978.

### NN/g — Compensatory vs Noncompensatory Decisions
<https://www.nngroup.com/articles/compensatory-noncompensatory-decisions/>

Dato duro para decidir cuántas opciones mostrar: "When we evaluate just a handful of alternatives (around 5–7), comparing the attributes of each is a feasible task", y "There is no need to support more than about 5 products in each of these tools". Arriba de ese umbral la gente deja de comparar atributos y pasa a eliminar por filtros, que es peor para un estudio con 3-4 servicios.

### NN/g — Explicitly State the Difference Between Options
<https://www.nngroup.com/articles/explicit-differences/>

"If options differ on only a few attributes, highlight those features in a comparison table or move them to the top of the list." El error que documentan no es tener tabla comparativa sino tenerla plana: la tabla de fastpens.com listaba diferencias sin señalar cuáles importaban. También señalan terminología ambigua sin definir como causa de confusión. No prescribe un número óptimo de opciones.

### NN/g — Progressive Disclosure
<https://www.nngroup.com/articles/progressive-disclosure/>

Dos reglas que aplican directo a pricing: el reparto entre nivel 1 y nivel 2 debe basarse en frecuencia de uso real, y los diseños que pasan de dos niveles de disclosure generan problemas porque "users often get lost when moving between the levels". La etiqueta del disparador debe fijar expectativa clara de qué hay del otro lado (information scent).

### Baymard Institute — Reduce Cart Abandonment
<https://baymard.com/learn/reduce-cart-abandonment>

39% de usuarios abandonan por costos extra que aparecen demasiado tarde: es la causa principal de abandono en su base de investigación. No es un dato de páginas de servicios, es de checkout ecommerce, pero el mecanismo es idéntico al de un "desde 2,000" que en la propuesta se convierte en 6,500. Baymard no publica investigación específica sobre páginas de precios de servicios; usarlo como analogía, no como evidencia directa.

### Designjoy
<https://designjoy.co/>

El extremo opuesto a "desde": un solo plan, $4,995/mes, sin "starting at" ni cotización. Lo interesante no es el precio sino que publican una lista explícita de lo que NO hacen (modelado 3D, animación, video, diseño editorial extenso, InDesign) y cómo manejan el alcance sin cobrar extra: "one request at a time", proyectos grandes troceados en entregas de 24-48h. Elimina el bait-and-switch quitando la variable, no explicándola.

### Superside
<https://www.superside.com/pricing>

"Starting at $30,000 a month, on a 12-month term" para el plan Dedicated, piso de $15,000/mes en Flex, y — esto es lo relevante — un cargo adicional de $1,000/mes de software declarado en la misma página. El piso funciona como filtro de calificación: quien no tiene $15k se va solo. Punto flojo: no hay ningún mecanismo de autoservicio, todo termina en "book a call with us and we'll recommend a budget for you".

### Shopify POS
<https://www.shopify.com/pos/pricing>

El mejor modelo encontrado para "desde X con complemento obligatorio": cada tarjeta dice "Starting at $39USD/month" y justo debajo, en la misma tarjeta, "+ $89 USD/month for each POS Pro location". El FAQ da la fórmula completa del costo: "The total cost of Shopify POS is a combination of your plan, transaction fees, and POS Pro locations". Las comisiones (2.9% + 30¢) están desglosadas por tier. Nada relevante queda fuera de la página.

### HubSpot CRM (pricing)
<https://www.hubspot.com/pricing/crm>

Caso de bait-and-switch documentado. La página muestra "Starts at $7/mo/seat" y no menciona en ningún lado la cuota de onboarding obligatoria y no reembolsable de $3,000 en Professional (y $7,000 en Enterprise), que solo aparece en el checkout. Es la queja de precio más citada en reseñas de HubSpot y hay quejas formales en el BBB al respecto. La lección: el problema no fue el "starts at", fue el cargo obligatorio no revelado en la misma vista.

### Odoo
<https://www.odoo.com/pricing>

Separa explícitamente suscripción de implementación, que es exactamente el modelo de Morphiq (3,000/mes + implementación). $24.90/usuario/mes para Standard, y la implementación va aparte en "Success Packs" con un estimador de proyecto para empresas de menos de 50 empleados. Su calculadora funciona porque solo pide dos entradas (qué apps y cuántos usuarios) y recalcula en pantalla — no es un configurador de especificaciones, que es lo que NN/g advierte que fracasa.

### Basecamp
<https://basecamp.com/pricing>

Cinco niveles ($0, $25, $59, $100, $300/mes), ninguno con "starting at" ni cotización. Convierte la ausencia de precio variable en argumento de venta: "No per-user fees, everyone's included. Simple fixed prices — another Basecamp exclusive". También elimina fricción de salida: "Cancel any time, no questions asked, no forms to fill out, no person to talk to". Cinco opciones es el techo de lo comparable según la propia investigación de NN/g.

### Bozh Studio — Small Business Website Cost
<https://bozhstudio.com/small-business-website-cost/>

La mejor ejecución encontrada de la recomendación de NN/g de "precios de muestra". Cuatro rangos ($500–1,500 / $2,500–5,500 / $5,500–10,000 / $10,000–30,000+) y luego proyectos reales de su portafolio con el precio que cobraron: PCARD Payments ~$3,500, Remont Construction ~$5,500, RMG Housing ~$7,500, Tantalus ~$12,000, Golden State ADUs ~$15,000. Explica siete factores que mueven el precio y desglosa costos recurrentes (mantenimiento $300 o $500/mes, más $120/hora por trabajo adicional). El CTA pide presupuesto aproximado del cliente.

### New Emage (MX)
<https://newemage.com.mx/cuanto-cuesta-una-pagina-web-en-mexico/>

El competidor mexicano mejor ejecutado que encontré. Usa "desde" por tipo de proyecto con tiempo de entrega: landing "Desde $15,900 MXN" (1–2 semanas), institucional "Desde $24,900" (3–4 semanas), e-commerce "Desde $49,900" (4–6 semanas). Incluye tabla comparativa por tipo de proveedor (DIY $999 / freelance $5,000–25,000 / agencia $15,900–49,900 / enterprise $50,000–200,000+), lo que posiciona su precio en contexto. Falla en un punto: su cotizador entrega el estimado por correo, o sea que bloquea la autocalificación detrás del formulario.

### desarrollodepaginasweb.com.mx (MX)
<https://www.desarrollodepaginasweb.com.mx/precios-de-paginas-web-en-mexico/>

Seis paquetes con precio fijo (Económico $4,800, Emprendedor $6,800, Negocios $8,800, Microempresa $10,800, PyME $12,800, Empresarial $14,800) presentados como tarjetas sueltas, sin tabla comparativa. Seis opciones diferenciadas solo por "hasta N secciones" excede el umbral de comparación y los nombres no comunican diferencia real. Hace bien una cosa: declara que dominio, hosting y SSL tienen periodo de 12 meses y luego se renuevan.

### mexico-paginasweb.com (MX)
<https://www.mexico-paginasweb.com/diseno-web/>

Ejemplo del ancla-cebo. "Diseño Web México desde $990" con una lista de inclusiones que no es creíble a ese precio: dominio .com, 5GB hosting, SSL, 10 cuentas de correo, 10 secciones, galería, blog, SEO, panel de administración y un año de soporte. No hay ninguna divulgación de qué cuesta la renovación del dominio ni del hosting al año 2, ni qué pasa cuando termina el soporte gratuito. Es exactamente el patrón que hace que el prospecto desconfíe del "desde" de todos los demás.

### ComparaSoftware — Punto de Venta (MX)
<https://www.comparasoftware.com/punto-de-venta>

Anti-patrón puro en la categoría POS mexicana: un top 10 de software sin un solo precio. Cada producto tiene únicamente botones "Consultar sin costo" y "Cotizar". Tienen filtros por modelo de pago (prueba gratuita, pago mensual, pago anual, pago única vez) pero nunca muestran cifras. Es el comportamiento que NN/g describe como el que hace que la empresa parezca "dubious" — y en este caso es toda la categoría, o sea que es una ventaja competitiva disponible para quien sí publique.

### listoweb.com.mx — no cargó
<https://listoweb.com.mx/precios-de-paginas-web/>

Aparece en los resultados de búsqueda como comparador de precios de páginas web en México (rango citado en el snippet: planes desde $1,999 hasta más de $35,000 MXN) pero devolvió contenido vacío en dos intentos de WebFetch, probablemente por bloqueo a bots. No pude verificar cómo presenta los precios; sustituido por desarrollodepaginasweb.com.mx y mexico-paginasweb.com.

### pulpos.com — no cargó
<https://pulpos.com/blog/cuanto-cuesta-un-punto-de-venta-en-promedio/>

Artículo mexicano sobre cuánto cuesta un punto de venta; devolvió HTTP 403 Forbidden. No verificado. Los rangos de POS en México que aparecen en búsqueda (desde ~$299/mes, ~$800/mes, ~$1,200/mes, versiones completas desde ~$5,000/mes) vienen de snippets de terceros, no de páginas que yo haya podido abrir; tratarlos como indicativos, no como dato confirmado.

### Parrot Software (México, CDMX)
<https://parrotsoftware.com.mx/tipos-de-restaurante/taqueria>

El mejor ejemplo de página vertical que vi, y es mexicano. No tiene una página 'restaurantes': tiene una página por SUB-vertical (taquería, cafetería, pizzería, heladería, bar, quick service, cadena, premium). La de taquería abre con H1 literal 'Punto de venta y terminal de pago para taquerías' + 'Más que un sistema: el cerebro de tu taquería' + prueba de conteo 'Más de 1,000 restaurantes y taquerías usan Parrot'. Lo que la hace funcionar no son features sino ESCENAS OPERATIVAS escritas en el vocabulario de la cocina: 'Parrot envía cada orden al área correcta para que trompo, plancha y bebidas trabajen en sincronía', 'Cada quien paga sus tacos, sin enredos', 'Cuando baja el fuego, sube la promo'. Cierra con métricas duras ('+10 horas recuperadas', '99% discrepancias en caja eliminadas', 'aumenta 14% la rotación de mesas', '+28% ticket promedio') y testimonios de taquerías reales con nombre (Mata de Chile, Don Macizo, Tacos a Vapor Don Pedro). Lo malo: CERO precios en todo el sitio, todo va a WhatsApp con 'Cotiza ahora' / 'Agenda llamada'; y el menú QR casi no existe — solo aparece como autofacturación desde el ticket. Su único gancho interactivo es 'Prueba este Demo en tiempo real'.

### Nei Digital (México, Guadalajara)
<https://nei.digital/>

El empaquetado más replicable para un estudio chico, y con precios públicos en MXN. Abre con un H1 que es un resultado, no un producto: 'Tu negocio funciona, cuadra y te reporta. Sin que tú estés ahí.' Los tres primeros dolores que nombra son literalmente citas del dueño, no features: '¿Me estarán robando?', 'Pago 3 apps que no se hablan.', 'Si no estoy, no sé qué pasa.' Ningún competidor internacional se atreve a ser tan directo. La escalera comercial es la clave: Menú Gratis $0 (menú digital con QR, actualización en tiempo real, catálogo básico) → Opera $1,197/mes → Administra $1,897/mes → Dirige $3,499/mes + $3,500 de implementación única. El menú QR NO es el producto: es el peldaño cero para capturar al que 'apenas explora'. Doble CTA en el hero segmentando por madurez: 'Diagnóstico gratis de 20 min' para el que ya opera y '¿Apenas empiezas? Crea tu menú digital gratis' para el que no. Bloques de valor nombrados en imperativo corto: 'Opera sin caos', 'Controla tu dinero', 'Mata la merma', 'Haz que vuelvan'. Garantía explícita contra la fricción: '7 días gratis, sin tarjeta. Cancelas cuando quieras, sin letra chica.' Orden de página: Problemas → Soluciones → Clientes → Precios → Garantía → CTA.

### OlaClick (LatAm, opera en México)
<https://olaclick.com/es/>

Es el competidor de precio que Morphiq va a encontrar de frente. H1: 'El sistema con IA que aman los restaurantes', y el subtítulo mete el precio de inmediato: 'Punto de venta, menú digital y herramientas marketing impulsadas con IA desde $8 al mes. Respaldado por Google y Meta.' La página de menú digital es aún más agresiva: 'Digital Menus for restaurants, FREE and WITHOUT COMMISSION!' — el gancho no es 'digitalízate', es 'sin comisión', atacando directo a Rappi/UberEats/DiDi. Presenta el menú QR con un flujo ilustrado de 3 pasos (escanea el QR en la mesa → elige productos → la orden entra), no con lista de features. Enfrenta objeciones concretas: ahorra llamadas, sube margen quitando comisiones, funciona offline después de descargar. Justifica el upsell con una frase de precio anclado: 'premium features 🚀 for the value of a lunch'. Prueba social por volumen ('más de 40,000 restaurantes', '1.3 millones de órdenes mensuales') y prensa (Forbes, TechCrunch, Reforma). Debilidad explotable: el sitio es multipaís y genérico — testimonios de Brasil, Argentina y Colombia, teléfono +1, cero olor a México. Un taquero de CDMX no se ve ahí.

### Owner.com (Estados Unidos)
<https://www.owner.com/online-menu>

El mejor modelo de cómo vender SITIO WEB + PEDIDOS a restaurantes, que es exactamente el terreno de Morphiq (no POS). Nunca dice 'te hago una página web'; dice 'The AI platform restaurants use to grow online discovery' y en la página de menú: 'An online menu that turns visitors into customers.' El gancho del hero es un diagnóstico automático, no un formulario de contacto: 'Get my AI report' que devuelve un 'Restaurant website health score' del tipo '36/100 poor... losing $450 monthly in sales' — convierte una auditoría en lead magnet y cuantifica el dolor en dinero antes de pedir nada. El enemigo está nombrado en boca de clientes, no de la marca: 'keeping all the profits for my store instead of giving 30-40% away', '25% to 35% in commission fees'. La prueba social es su mejor activo: 10 casos con negocio real + dos números cada uno (Metro Pizza +54% ventas / 11,000 instalaciones de app; Cyclo Noodles +$104,500 en ventas online / $31,000 ahorrados en comisiones; Mattenga's Pizzeria $192,000 de crecimiento en 30 días). Precio oculto en home pero publicado en /pricing: $249/mes + 5% por orden, o $499/mes plano, sin contrato ni costo de setup — lo justifica contra el 15-40% que cobran las apps. Copiable: gatear el precio en la home pero tener una página de precios honesta a un clic.

### MenuTiger (global, especialista en menú QR)
<https://www.menutiger.com/>

Útil como contraejemplo de cómo NO posicionar el menú QR, y de cómo sí presentarlo visualmente. H1 promete un número sin fuente: 'Boost Restaurant Sales by 30% With Digital Menus, Online Ordering & Marketing Tools' — el clásico tópico de marketing que un restaurantero mexicano no cree. Los problemas que nombra siguen anclados en 2021 (contactless ordering, costos de impresión, tiempos de espera) en vez de dinero y control; suenan viejos. Lo que sí vale la pena robar: el bloque de QR preview donde muestran el código junto al mockup del teléfono con el menú ya renderizado, o sea el antes/después en una sola imagen; y la galería de plantillas, que resuelve la objeción muda de '¿se va a ver bonito el mío?'. Precio: gratis con upgrade 'from $14/month (billed annually)', sin desglose de planes en home. Testimonios con resultado específico ('20% increase in average order size'). Estructura estándar de SaaS: hero → indicadores de confianza → grid de features → integraciones → demo QR → plantillas → testimonios → CTA → FAQ.

### Google Search Central — Estructura de URL
<https://developers.google.com/search/docs/crawling-indexing/url-structure>

Recomienda palabras legibles en vez de IDs (example.com/wiki/Aviation frente a index.php?topic=42&area=3a5eb...), guiones y no guiones bajos («We recommend using hyphens (-) instead of underscores (_)»), palabras en el idioma de la audiencia (vale /servicios/paginas-web), percent-encoding para no-ASCII, y evitar IDs de sesión y parámetros que no cambian el contenido. Dice explícitamente: «Don't use fragments to change the content of a page, as Google Search generally doesn't support URL fragments» — o sea, la home actual de una sola página con #servicios nunca tuvo URLs indexables por sección. En ningún punto afirma que la estructura de URL sea factor de ranking: el argumento es rastreo e indexación.

### Google Search Central — Haz que tus enlaces sean rastreables
<https://developers.google.com/search/docs/crawling-indexing/links-crawlable>

Regla dura: «Google can only crawl your link if it's an <a> HTML element with an href attribute». No sigue <a onclick="goto(...)">, <a href="javascript:goTo('products')">, <span href=...> ni routerLink de framework. Sí sigue enlaces insertados por JS si acaban siendo <a href>. Y: cada página importante necesita «a link from at least one other page on your site». Relevante para el repo: src/components/layout/Navegacion.jsx sí genera <a href> reales (Link/NavLink de react-router), pero el desplegable de Servicios está dentro de {abierto && ...} — los cinco enlaces a /servicios/* solo existen en el DOM cuando alguien abre el menú, y Googlebot no hace clic. Además src/components/layout/Footer.jsx sigue siendo el del sitio de una página: enlaza a href="#inicio" y a fragmentos, no a las rutas nuevas.

### Google Search Central — Control del título en resultados
<https://developers.google.com/search/docs/appearance/title-link>

Google saca el título de varias fuentes, no solo del <title>: h1, og:title, texto grande y prominente, anchor text de enlaces entrantes y structured data WebSite. «There's no limit on how long a <title> element can be, but the title link is truncated in Google Search results as needed» — no hay límite oficial de 60 caracteres. Pide títulos únicos por página, sin texto boilerplate repetido, con la marca al principio o al final separada por un delimitador, y sin repetir palabras. Reescribe el título cuando detecta fechas desfasadas, títulos imprecisos, varios encabezados igual de prominentes o desajuste de idioma.

### Google Search Central — Fragmentos (meta description)
<https://developers.google.com/search/docs/appearance/snippet>

«Snippets are primarily created from the page content itself. However, Google sometimes uses the meta description HTML element if it might give users a more accurate description of the page» — la description es una candidata, no una garantía. Pide description de nivel de sitio solo en la home y de nivel de página en el resto, con datos concretos (precio, autor, fecha). Las descriptions que son cadenas de keywords «are less likely to be displayed as a snippet». La página no dice en ningún momento que la meta description sea factor de ranking.

### Google Search Central — Galería de resultados enriquecidos
<https://developers.google.com/search/docs/appearance/structured-data/search-gallery>

Lista completa de tipos con apariencia soportada: Article, Breadcrumb, Carousel, Course list, Dataset, Discussion forum, Education Q&A, Employer aggregate rating, Event, Image metadata, Job posting, Local business, Math solver, Movie, Organization, Product, Profile page, Q&A, Recipe, Review snippet, Software app, Speakable, Subscription/paywalled content, Vacation rental, Video. NO existe un tipo «Service». El nodoServicio() de /home/user/MH-web-2.0/src/lib/seo.jsx es válido en schema.org pero no produce ningún resultado enriquecido en Google.

### Google Search Central — Datos estructurados Organization
<https://developers.google.com/search/docs/appearance/structured-data/organization>

«There are no required properties; instead, add the properties that apply to your organization». Colocación: «We recommend placing this information on your home page, or a single page that describes your organization, for example the about us page. You don't need to include it on every page of your site». Propiedades útiles aquí: name, url, logo (mínimo 112x112), address, telephone, email, sameAs, description, foundingDate, taxID/vatID. Pide usar el subtipo más específico. En el repo el bloque va en index.html, o sea que se sirve en todas las rutas del shell: no es un error, pero tampoco aporta nada fuera de la home.

### Google Search Central — BreadcrumbList
<https://developers.google.com/search/docs/appearance/structured-data/breadcrumb>

Propiedades requeridas: itemListElement, y en cada ListItem position (entero, empieza en 1), name e item (URL). En el último elemento item es opcional: si se omite, Google usa la URL de la propia página. Se pueden declarar varios BreadcrumbList en un array JSON-LD si hay varias rutas de navegación hacia la misma página. Es de los pocos tipos de esta lista que un sitio de servicios multipágina puede aprovechar de verdad, y el nodoMigas() del repo ya lo emite bien salvo que incluye item en el último paso (correcto, solo redundante).

### Google Search Central — LocalBusiness
<https://developers.google.com/search/docs/appearance/structured-data/local-business>

Requeridas: name y address (PostalAddress con calle, localidad, región, CP, país). Recomendadas: telephone, openingHoursSpecification, priceRange (<100 caracteres), geo (mínimo 5 decimales), url, image en 16:9, 4:3 y 1:1, department. La documentación NO da guía específica para negocios sin local físico ni de área de servicio, NO menciona listar servicios ni ofertas dentro del marcado, y NO habla de la relación con Google Business Profile. El JSON-LD del repo declara ProfessionalService (subtipo de LocalBusiness) con address a nivel de alcaldía, sin calle: cumple lo mínimo pero es el punto débil de todo el bloque.

### Google Search Central — Directrices generales de datos estructurados
<https://developers.google.com/search/docs/appearance/structured-data/sd-policies>

Tres reglas verbatim que mandan sobre todo lo demás: «Don't mark up content that is not visible to readers of the page», «Your structured data must be a true representation of the page content» y «Don't mark up irrelevant or misleading content». Entre las causas de que un marcado no genere resultado enriquecido cita «The content referred to by the structured data is hidden from the user». Marcar precios o preguntas que no están en el HTML visible de esa misma página es infracción, no optimización.

### Google Search Central — Introducción a los datos estructurados
<https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data>

«Most Search structured data uses schema.org vocabulary, but you should rely on the Google Search Central documentation as definitive for Google Search behavior, rather than the schema.org documentation». Los tipos no documentados por Google pueden ser válidos y no activar nada. JSON-LD es el formato recomendado («the easiest solution for website owners to implement and maintain at scale») y puede ir en <head> o en <body>. Confirma que «Google can read JSON-LD data when it is dynamically injected into the page's contents, such as by JavaScript code» — el enfoque imperativo de src/lib/seo.jsx es admisible.

### Google Search Central — FAQPage
<https://developers.google.com/search/docs/appearance/structured-data/faqpage>

Hallazgo importante y reciente: el resultado enriquecido de FAQ está muerto. Agosto 2023 lo limitó a «well-known, authoritative government and health websites», septiembre 2023 lo retiró de escritorio y móvil, y en junio 2026 Google eliminó la documentación de la función porque «The FAQ rich result feature is no longer shown in Google Search results». El nodoPreguntas() del repo no daña, pero no va a producir absolutamente nada en Google. Cualquier plan de contenido que dependa de «poner FAQs para ganar espacio en la SERP» está construido sobre una función que ya no existe.

### Google Search Central — Fundamentos de SEO para JavaScript
<https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>

Googlebot procesa en tres fases separadas: rastreo, renderizado e indexación; las páginas con 200 entran a una cola de renderizado donde Chromium ejecuta el JS antes de indexar. Para SPAs advierte contra los fragmentos de URL porque «Googlebot can't reliably resolve the URLs» y manda usar la History API con URLs únicas — createBrowserRouter del repo cumple. Títulos, descriptions y canonical se pueden inyectar con JS, pero recomienda que el canonical venga ya en el HTML original. Sobre soft 404 en SPAs: hay que redirigir a una URL que devuelva 404 del servidor o inyectar <meta name="robots" content="noindex">.

### Google Search Central — Solucionar problemas de JavaScript
<https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript>

Herramientas para ver lo que ve Googlebot: Prueba de resultados enriquecidos e Inspección de URLs en Search Console, que muestran DOM renderizado, recursos cargados, consola y excepciones. «Googlebot caches aggressively in order to reduce network requests and resource usage. WRS may ignore caching headers» — hay que usar fingerprinting en los nombres de archivo (main.2bb85551.js), cosa que Vite ya hace. Avisa de que WRS «may not fetch» recursos que juzgue no esenciales, de que las funciones que piden permiso al usuario no tienen sentido para Googlebot, de que localStorage/cookies se limpian entre cargas, y de que el contenido que depende de interacción no se indexa.

### Google Search Central — Renderizado dinámico (obsoleto)
<https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering>

Google desmontó su propia recomendación anterior: «Dynamic rendering was a workaround and not a long-term solution for problems with JavaScript-generated content in search engines» y «is a workaround and not a recommended solution, because it creates additional complexities and resource requirements». Lo que recomienda en su lugar es explícito: renderizado en servidor, renderizado estático o hidratación. Para Morphiq esto significa: nada de servir HTML distinto a bots; prerenderizar de verdad en el build.

### web.dev — Rendering on the web
<https://web.dev/articles/rendering-on-the-web>

Taxonomía y costes: estático/SSG da FCP rápido, TBT/INP bajo y TTFB constante a cambio de conocer las URLs en build (perfecto para un sitio de 11 rutas fijas); SSR da FCP rápido pero carga cómputo en TTFB; SSR con rehidratación produce el peor caso de usabilidad, «a page looks ready but none of its interactive features work», castigando INP y TBT en móvil; CSR es máxima flexibilidad y máximo riesgo de rendimiento. Sobre SEO en CSR: «Crawlers can understand JavaScript, but there are often limitations to how they render». La configuración actual del repo (Vite + React Router, sin paso de prerender) es CSR pura.

### web.dev — Core Web Vitals
<https://web.dev/articles/vitals>

Umbrales «good» exactos: LCP «within 2.5 seconds», INP «200 milliseconds or less», CLS «0.1 or less», medidos «at the 75th percentile of page loads, segmented across mobile and desktop devices». INP sustituyó a FID como métrica estable en 2024. Contraste con el repo: el hero carga three.js, @react-three/fiber, @react-three/drei, ogl, motion y lenis, más un laptop.glb; eso es exactamente el perfil de JS que revienta INP en gama media, que es el teléfono de la PyME que va a evaluar a Morphiq.

### Google Search Central — Page experience
<https://developers.google.com/search/docs/appearance/page-experience>

Corta el mito de un factor único: «There is no single signal. Our core ranking systems look at a variety of signals that align with overall page experience». Confirma que «Core Web Vitals are used by our ranking systems», pero HTTPS, mobile-friendliness y ausencia de interstitials intrusivos no dan impulso directo. Y el matiz que más gente ignora: «Google Search always seeks to show the most relevant content, even if the page experience is sub-par». La velocidad desempata; no sustituye a tener la página correcta para la consulta.

### Google Search Central — Sitemaps: descripción general y construcción
<https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap>

Dos frases que invalidan medio archivo del repo: «Google ignores <priority> and <changefreq> values» y «Google uses the <lastmod> value if it's consistently and verifiably (for example by comparing to the last modification of the page) accurate», reservado para cambios significativos de contenido principal, datos estructurados o enlaces. URLs absolutas y solo canónicas; límite 50 MB / 50.000 URLs. En el repo: /home/user/MH-web-2.0/public/sitemap.xml contiene una única URL (la home) con priority y changefreq, y /home/user/MH-web-2.0/scripts/sitemap.mjs estampa la MISMA fecha del último commit en todos los <lastmod> — justo el patrón de lastmod no verificable que Google dice ignorar. En la descripción general añade que un sitio «small», «about 500 pages or fewer», puede no necesitar sitemap, y que el sitemap no garantiza rastreo ni indexación.

### Google Search Central — Consolidar URLs duplicadas (canonical)
<https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>

El canonical es señal, no orden: «none of them are required; your site will likely do just fine without specifying a canonical preference... Google will identify which version of the URL is objectively the best version». Métodos por fuerza: redirección (la más fuerte) > link rel=canonical > sitemap (señal débil). Recomienda autorreferencia. Errores listados: mezclar http/https o www/no-www, y apuntar todo a la home. Riesgo concreto en el repo: index.html lleva canonical fijo a https://www.morphiq.com.mx/ y src/lib/seo.jsx lo reescribe al montar la ruta; sin prerender, el HTML servido en /precios declara la home como canónica hasta que React monta.

### Google Search Central — Migración de sitio con cambio de URLs
<https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes>

Redirecciones permanentes de servidor (301/308). «Don't redirect many old URLs to one irrelevant single URL destination, such as the home page of the new site». «Keep the redirects for as long as possible, generally at least 1 year». Actualizar los enlaces internos según el mapeo, enviar sitemaps de URLs viejas y nuevas, y usar Cambio de dirección en Search Console solo si cambia dominio o subdominio. Matiz para Morphiq: como el sitio actual es una sola página con anclas, no hay URLs viejas que redirigir (los fragmentos nunca se indexaron por separado); lo que sí hay que preservar es que / siga siendo / y que los enlaces externos existentes no se rompan.

### Google Search Central — Políticas de spam
<https://developers.google.com/search/docs/essentials/spam-policies>

Define doorway abuse como «sites or pages... created to rank for specific, similar search queries. They lead users to intermediate pages that are not as useful as the final destination», con el ejemplo directo de «multiple domain names or pages targeted at specific regions or cities that funnel users to one page». Scaled content abuse: «many pages are generated for the primary purpose of manipulating search rankings and not helping users... large amounts of unoriginal content... no matter how it's created». Esto pone un techo explícito a la tentación de clonar /servicios/paginas-web en versiones por alcaldía o por giro, que es la táctica estándar de las agencias locales.

### Google Search Central — Guía de iniciación al SEO
<https://developers.google.com/search/docs/fundamentals/seo-starter-guide>

«Using directories (or folders) to group similar topics can help Google learn how often the URLs in individual directories change» — argumento oficial a favor de /servicios/... como carpeta real. «The vast majority of the new pages Google finds every day are through links». Sobre el anchor text: «This text tells users and Google something about the page you're linking to». Y una expectativa que hay que trasladar al cliente: «Some changes might take effect in a few hours, others could take several months. In general, you likely want to wait a few weeks to assess whether your work had beneficial effects».

### Google Search Central — Nombre del sitio en resultados
<https://developers.google.com/search/docs/appearance/site-names>

Se controla con datos estructurados WebSite y name + url requeridos, más alternateName opcional. Condición dura: «must be on the home page of a site... the domain or subdomain level root URI». Los subdirectorios no pueden tener nombre propio. Google también mira og:site_name, <title>, encabezados y contenido de la home, pero «WebSite structured data is most important, if you want to specify a preference». Encaja con el par Morphiq / Astral Morphiq Systems que ya está en el JSON-LD del index.html.

### Google Search Central — Crear contenido útil y fiable (E-E-A-T)
<https://developers.google.com/search/docs/fundamentals/creating-helpful-content>

Preguntas de autoevaluación citables para un estudio de una persona: «Is it self-evident to your visitors who authored your content? Do pages carry a byline, where one might be expected?», «Do bylines lead to further information about the author or authors involved?» y «Does your content clearly demonstrate first-hand expertise and a depth of knowledge (for example, expertise that comes from having actually used a product or service)». Y el corte: «Is the content primarily made to attract visits from search engines?... that's not aligned with what our systems seek to reward». Para Morphiq, el activo real es Miguel con nombre, cara y casos verificables, no volumen de páginas.

### web.dev — Core Web Vitals (Vitals)
<https://web.dev/articles/vitals>

Fuente canónica de los tres umbrales vigentes: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Todo se evalúa al percentil 75 de cargas de página, segmentado por móvil y escritorio, y una página solo "pasa" si cumple las tres al p75. FID quedó retirado: INP pasó de experimental (2023) a métrica estable en 2024. Cualquier checklist que siga citando FID está desactualizado.

### web.dev — Largest Contentful Paint (LCP)
<https://web.dev/articles/lcp>

Umbrales exactos: bueno ≤ 2.5 s, necesita mejora 2.5–4.0 s, malo > 4.0 s (p75). Candidatos a elemento LCP: <img>, <image> dentro de <svg>, <video> (poster o primer frame), elementos con background-image vía url(), y bloques con texto. Advierte que el LCP incluye tiempo de descarga de la página anterior, redirecciones y TTFB, lo que explica la brecha típica entre laboratorio y campo.

### web.dev — Optimize LCP
<https://web.dev/articles/optimize-lcp>

Da un presupuesto numérico por sub-parte que casi nadie aplica: TTFB ≈ 40 %, resource load delay < 10 %, resource load duration ≈ 40 %, element render delay < 10 %. Regla dura: "Never lazy-load your LCP image". Recomienda fetchpriority="high", <link rel="preload">, evitar font-display auto/block, y sacar el hero de un background-image CSS porque el preload scanner no lo descubre en el HTML.

### web.dev — Interaction to Next Paint (INP)
<https://web.dev/articles/inp>

Umbrales exactos: bueno ≤ 200 ms, necesita mejora 201–500 ms, malo > 500 ms (p75). Solo cuentan tres tipos de interacción: clic con ratón, tap en pantalla táctil y pulsación de tecla — scroll y hover NO cuentan. Mide la latencia de todas las interacciones de la visita, no solo la primera como hacía FID.

### web.dev — Optimize INP
<https://web.dev/articles/optimize-inp>

Descompone INP en tres partes: input delay, processing duration y presentation delay. Técnicas concretas: partir tareas largas cediendo el hilo principal con setTimeout, limitar el callback a lo mínimo para pintar el siguiente frame y diferir el resto con setTimeout dentro de requestAnimationFrame, reducir el tamaño del DOM, usar content-visibility para renderizar perezosamente, y evitar layout thrashing (escribir estilos y leerlos en la misma tarea).

### web.dev — Cumulative Layout Shift (CLS)
<https://web.dev/articles/cls>

Umbrales exactos: bueno ≤ 0.1, necesita mejora 0.1–0.25, malo > 0.25 (p75). Fórmula: layout shift score = impact fraction × distance fraction. Ventana de sesión: ráfaga de desplazamientos con menos de 1 s entre cada uno y máximo 5 s de duración total; el CLS reportado es el de la peor ventana, no la suma de toda la página.

### web.dev — Optimize CLS
<https://web.dev/articles/optimize-cls>

Correcciones concretas: atributos width/height en <img> (el navegador deriva el aspect-ratio) más img{height:auto;width:100%}; font-display: optional para evitar re-layout; overrides de métricas de fuente (size-adjust, ascent-override, descent-override, line-gap-override); <link rel=preload as=font type=font/woff2 crossorigin>; min-height o aspect-ratio en contenedores de anuncios/embeds. Animar transform: translate() en vez de top/left/box-shadow, porque las animaciones compositadas no cuentan para CLS. También señala que habilitar bfcache mejoró CLS de forma medible.

### web.dev — CSS min(), max() y clamp()
<https://web.dev/articles/min-max-clamp>

Patrón base de tipografía fluida: font-size: clamp(1.5rem, 5vw, 3rem) — mínimo, valor ideal escalable, máximo, sin media queries. Advertencia explícita de accesibilidad: limitar el tamaño máximo con max() o clamp() puede fallar WCAG 1.4.4 Resize text (AA) porque impide escalar el texto al 200 %. Ordena probar con zoom, no asumir.

### web.dev — Responsive and fluid typography with Baseline CSS
<https://web.dev/articles/baseline-in-action-fluid-type>

La guía más actual y la más útil: da la regla numérica que falta en el artículo de clamp — si el tamaño máximo es ≤ 2.5× el mínimo, el texto siempre pasa WCAG SC 1.4.4. Fórmula recomendada: html{font-size: clamp(1em, 17px + 0.24vw, 1.125em)}, con mínimo y máximo en em para que respondan a la preferencia del usuario y al zoom. Variante con unidades de contenedor: cambiar 0.24vw por 0.24cqi. Escala tipográfica con pow(): calc(1rem * pow(var(--scale), 2)).

### web.dev — Accessible tap targets
<https://web.dev/articles/accessible-tap-targets>

Mínimo recomendado 48 píxeles independientes de dispositivo (≈ 9 mm, el tamaño de la yema del dedo), con al menos 8 px de separación horizontal y vertical entre objetivos. Un icono de 24 px se lleva a 48 px con padding. Recomienda detectar entrada táctil con @media (any-pointer: coarse){ a{ padding: .8em } } en lugar de adivinar por ancho de viewport.

### Chrome for Developers — Lighthouse: Tap targets are not sized appropriately
<https://developer.chrome.com/docs/lighthouse/seo/tap-targets>

Regla de aprobación literal de la auditoría: los objetivos de 48×48 px nunca fallan. Falla solo si se cumplen ambas condiciones — el objetivo mide menos de 48×48 px Y al menos el 25 % de su área dentro de 48 px del centro se solapa con otro objetivo. Es decir, un botón pequeño pero bien aislado puede pasar; 8 px de separación es un punto de partida, no una garantía.

### web.dev — prefers-reduced-motion
<https://web.dev/articles/prefers-reduced-motion>

Dos valores: reduce y no-preference. La recomendación oficial es opt-in, no opt-out: envolver las animaciones decorativas en @media (prefers-reduced-motion: no-preference), de modo que quien pida menos movimiento no reciba ninguna por defecto. En JS los paréntesis son obligatorios: window.matchMedia('(prefers-reduced-motion: reduce)') y escuchar el evento change. Señala parallax, zoom y video en autoplay como los peores ofensores para trastornos vestibulares.

### web.dev — Responsive images (Learn Design)
<https://web.dev/learn/design/responsive-images>

Base CSS: img,video,iframe{max-inline-size:100%; block-size:auto}. srcset con descriptores de ancho más sizes reales del grid: srcset="small.png 300w, medium.png 600w, large.png 1200w" sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw". Descriptores de densidad 1x/2x/3x para tamaños fijos. width y height siempre presentes contra CLS; loading="lazy" bajo el pliegue, loading="eager" fetchpriority="high" en el hero. Para decorativas de fondo, image-set() en CSS. aspect-ratio + object-fit: cover + object-position para contenido de CMS con proporciones impredecibles. alt="" explícito en decorativas.

### web.dev — Color and contrast (Learn Accessibility)
<https://web.dev/learn/accessibility/color-contrast>

Ratios exactos: 4.5:1 para texto de tamaño normal (incluidas imágenes de texto); 3:1 para texto grande e iconos esenciales. Define texto grande como al menos 18 pt / 24 px, o 14 pt / 18.5 px en negrita. Logos y elementos decorativos quedan exentos. El ratio máximo posible es 21:1 (negro puro sobre blanco puro).

### web.dev — Accessible responsive design
<https://web.dev/articles/accessible-responsive-design>

Meta viewport correcto: <meta name="viewport" content="width=device-width, initial-scale=1.0">, y prohibición explícita de maximum-scale=1 y user-scalable=no. Exige que la página siga siendo legible y funcional con el texto al doble (WCAG 1.4.4), y muestra reflujo a 400 % de zoom. Insiste en em/rem en vez de píxeles para el texto y repite el mínimo de 48 px en objetivos táctiles.

### web.dev — Accessibility (Learn Design)
<https://web.dev/learn/design/accessibility>

Distingue :focus/:hover de :focus-visible — a:focus,a:hover{outline:1px dotted} más a:focus-visible{outline:3px solid}. Documenta prefers-contrast con tres valores (no-preference, less, more) y soporte desde Chrome 96, Edge 96, Firefox 101 y Safari 14.1. Recomienda probar la maquetación con el texto aumentado 200 % y 400 %, tratando el resultado como si fuera pantalla pequeña. No menciona tamaños táctiles: ese dato vive en el artículo de tap targets.

### Chrome for Developers — Lighthouse: Document doesn't use legible font sizes
<https://developer.chrome.com/docs/lighthouse/seo/font-size>

Criterio histórico: al menos 12 px en 60 % o más del texto; falla si 40 % o más del texto baja de 12 px. Importante para no vender humo: la auditoría está deprecada desde Lighthouse 13, así que ya no se usa como señal activa. Sirve como piso mínimo mental, no como métrica que se pueda prometer en un reporte.

### NN/g — Website Forms Usability: Top 10 Recommendations
<https://www.nngroup.com/articles/web-form-design/>

Dato duro citable: los formularios que cumplen las guías de usabilidad logran 78% de envíos correctos al primer intento vs 42% en las versiones que no las cumplen. Reglas concretas: una sola columna (las columnas múltiples rompen el momentum vertical), etiqueta arriba del campo en móvil, máximo 1-2 campos opcionales y marcarlos como tales, nunca botón 'Limpiar/Reset', y en errores usar tres señales a la vez (borde + texto rojo + peso tipográfico) conservando lo ya escrito.

### NN/g — Few Guesses, More Success: 4 Principles to Reduce Cognitive Load in Forms
<https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/>

Cuatro principios: Estructura (agrupar por secciones con encabezados), Transparencia (decir ANTES de empezar cuánto tarda y qué datos hacen falta — ejemplo Zillow), Claridad (lenguaje de 6º-8º grado, nada de jerga: 'Motivo de la visita' en vez de 'Motivo de consulta clínica') y Soporte (no usar placeholder como etiqueta, nada de validación prematura, error junto al campo). Es guía cualitativa, no trae datos numéricos.

### NN/g — Wizards: Definition and Design Recommendations
<https://www.nngroup.com/articles/wizards/>

El multipaso sirve para usuarios novatos y tareas infrecuentes — exactamente el perfil de una PyME que contrata software por primera vez. Reglas: mostrar la lista completa de pasos desde el primero, forzar el orden secuencial (si el usuario puede saltar pasos, la tarea no era para wizard), etiquetar botones con lo que realmente hacen en vez de 'Siguiente', y permitir salir guardando estado para retomar después.

### NN/g — Pricing information gives B2B sites a competitive advantage
<https://www.nngroup.com/articles/show-price/>

El precio es la necesidad de información #1 en cualquier sitio B2B. En sus pruebas, los participantes se van al sitio del competidor cuando no hay precio, y perciben a la empresa que lo esconde como evasiva y poco confiable. Cuando el precio real depende del caso, la recomendación explícita es publicar precios de escenarios típicos o un rango — NO un configurador, porque en fase de investigación el usuario no tiene el nivel de compromiso para completarlo.

### NN/g — B2B Usability (hallazgos de investigación)
<https://www.nngroup.com/articles/b2b-usability/>

Los sitios B2B logran 58% de éxito en tareas vs 66% en sitios de consumo. De 28 tipos de información evaluados, el precio quedó primero por mucho: 29% por encima del segundo lugar. Textual: la ausencia total de precios es 'el elemento más hostil de la mayoría de los sitios B2B'. También: los usuarios se resisten a llenar formularios de captación ANTES de que el proveedor se haya ganado credibilidad — el formulario no puede ir antes de la prueba.

### NN/g — What B2B Designers Can Learn from B2C About Building Trust
<https://www.nngroup.com/articles/b2b-trust-from-b2c/>

El primer sitio que muestra un precio ancla las expectativas del comprador. En testimonios, los participantes se fijan específicamente en el puesto y la empresa del autor (un testimonio anónimo no cuenta), y los más efectivos son los que narran escepticismo inicial que se convierte en confianza. Además: ver a las personas reales y la ubicación física del proveedor sube la percepción de legitimidad — decisivo para un estudio de una sola persona.

### NN/g — 'Get Started' Stops Users
<https://www.nngroup.com/articles/get-started/>

Un CTA genérico actúa como imán y canibaliza clics de contenido que el usuario sí necesitaba, y crea 'ilusión de completitud' (la gente no baja a leer el resto). Cita literal de un participante ante un flujo de T-Mobile: 'This is another hurdle to jump over and it's more likely I will probably leave this website. All I want is the price and if I like the price, then I'd call it.' Ese es exactamente el usuario de una PyME frente a un 'Cotiza tu proyecto'.

### NN/g — Better Link Labels: 4Ss for Encouraging Clicks
<https://www.nngroup.com/articles/better-link-labels/>

Marco de 4 criterios para CTAs: Específico (dice qué obtienes), Sincero (lo que pasa al hacer clic coincide con la etiqueta — el ejemplo malo es un botón 'MORE INFO & BOOK' que abre un formulario de contacto), Sustancial (se entiende fuera de contexto porque la gente escanea) y Conciso. Aclara que una etiqueta de 11 palabras es mejor que una vaga de dos.

### NN/g — Deceptive Patterns in UX: How to Recognize and Avoid Them
<https://www.nngroup.com/articles/deceptive-patterns/>

Taxonomía aplicable a sitios de servicios: confirmshaming (botón de rechazo tipo 'No gracias, no me interesa ahorrar'), obstrucción (dificultar la baja), sneaking/precheck (casillas de marketing premarcadas), nagging (volver a pedir el correo tras un 'no') y trucos visuales. Propone auditar con un recorrido cognitivo preguntando si el usuario podría compartir más datos de los que quería, malinterpretar la opción o sentirse presionado.

### Baymard Institute — Checkout Optimization: Minimize Form Fields
<https://baymard.com/blog/checkout-flow-average-form-fields>

El hallazgo más útil para decidir si hacer multipaso: 'el número de campos tiene mayor impacto en el desempeño que el número de pasos'. Promedio 2024: 11.3 campos en 5.1 pasos (bajó desde 12.7 en 2019); el objetivo recomendado es 8. 17% ha abandonado por proceso demasiado largo o complicado. Traducción para Morphiq: partir un formulario largo en pasos no compensa pedir datos de más.

### Baymard Institute — Explain Why the 'Phone Field' Is Required
<https://baymard.com/blog/explain-phone-number-field>

14% de los usuarios se niega a dar su teléfono y 39% de los sitios lo piden sin explicar por qué. En las pruebas: 'Normally I wouldn't fill in something like Phone Number… I simply can't see what they need that for', y un participante confesó teclear '9999'. La solución probada es una frase corta pegada al campo ('Por si necesitamos contactarte sobre tu pedido'), que basta para desactivar la resistencia.

### Baymard Institute — Avoid Extensive Multicolumn Layouts
<https://baymard.com/blog/avoid-multi-column-forms>

En pruebas, los formularios a dos columnas hacen que los usuarios omitan campos obligatorios y llenen campos que no les correspondían, porque la atención se dispersa en varias direcciones; los separadores visuales no arreglan el problema. Única excepción: 2-3 inputs en la misma línea cuando pertenecen a una sola entidad (ciudad/CP, mes/año de vencimiento), dentro de un formulario que por lo demás es de una columna.

### Baymard Institute — Marcar campos obligatorios Y opcionales (solo 14% lo hace)
<https://baymard.com/blog/required-optional-form-fields>

Solo 14% de los sitios marca explícitamente ambos tipos de campo (era 9% en 2012, 14% en 2016 y sigue en 14% en el benchmark 2021 — no ha mejorado en una década). No hacerlo produce errores de validación innecesarios, confusión sobre qué hay que llenar y abandonos. Es la fricción más barata de eliminar que existe.

### Baymard Institute — Usability Testing of Inline Form Validation
<https://baymard.com/blog/inline-form-validation>

31% de los sitios no valida inline y 4% la implementa mal. Reglas verificadas: validar en 'blur' (al salir del campo), no mientras se escribe — cita de prueba: 'Why are you telling me my email address is wrong, I haven't had a chance to fill it all out yet?'; una vez que hay error, re-validar en cada tecla para que desaparezca al corregir; y usar validación positiva (palomita verde) porque reduce la carga cognitiva y evita que el usuario relea todo antes de enviar.

### Baymard Institute — Form Design: 6 Best Practices
<https://baymard.com/learn/form-design>

18% abandona por formularios percibidos como 'demasiado largos o complicados', y los participantes se intimidan cuando ven 10-15+ campos en una sola pantalla. La táctica concreta es esconder campos opcionales y de uso poco frecuente detrás de un enlace, con lo que se logra una reducción de 20 a 60% de los campos visibles por defecto — sin dejar de recolectarlos.

### MIT / InsideSales — Lead Response Management Study (PDF original de 2007)
<https://25649.fs1.hubspotusercontent-na2.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf>

Fuente primaria verificada leyendo el PDF: James Oldroyd (Sloan School of Management, MIT) con InsideSales.com; 3 años de datos, 6 empresas, +15,000 leads y +100,000 intentos de llamada. Hallazgos: las odds de CONTACTAR caen 100x entre llamar a los 5 min vs 30 min, y las de CALIFICAR caen 21x; en la primera hora las odds de contactar caen más de 10x. Mejores días miércoles y jueves; peor hora 1-2 pm. ESCÉPTICO: es de 2007, patrocinado por un vendor de marcadores telefónicos, solo 6 empresas de su propia base (sesgo de selección), y son razones de momios, no 'conversión 100 veces mayor' como se cita por ahí. La dirección es sólida, la magnitud no es trasladable a México ni a WhatsApp.

### Venture Harbour — 5 estudios sobre longitud de formulario (contraejemplos)
<https://ventureharbour.com/how-form-length-impacts-conversion-rates/>

El antídoto contra el dogma de 'menos campos siempre convierte más'. Michael Aagaard (Unbounce) quitó campos y la conversión CAYÓ 14% — su conclusión: 'I removed all the fields that people actually want to interact with'; al restaurarlos y solo cambiar las etiquetas subió 19.21%. MarketingExperiments probó 15 campos contra una base de 11 y subió 109% la conversión Y mejoró la calidad del lead. Ningún estudio establece causalidad; lo que decide es si el campo tiene sentido para el usuario, no cuántos son.

### Viget — página de contacto (formulario real inspeccionado en el HTML)
<https://www.viget.com/contact/>

El mejor modelo encontrado para servicios de ticket medio. 9 campos, solo 4 marcados con asterisco: Your Name*, Company*, Email*, How can we help?*. Presupuesto ('Do you have a budget in mind?'), fecha de inicio, '¿cómo nos conociste?' y adjuntar archivos son OPCIONALES y de texto libre, no dropdowns obligatorios — califican sin bloquear. Promesa explícita: 'we'll get back to you in one business day'. Antispam con honeypot invisible (campo _gotcha), NO captcha. Ofrece además un correo directo alternativo.

### JuCri — Diseño Web (competidor mexicano directo, formulario Divi)
<https://www.jucri.com.mx/>

Catálogo de errores en un competidor real. Formulario con 4 campos TODOS obligatorios (Nombre, Telefono, Email, '¿De que se Trata tu Negocio o Proyecto?') MÁS un captcha matemático obligatorio ('12 + 2 =') — fricción máxima en el momento de menor compromiso. Las etiquetas van solo como placeholder (desaparecen al escribir). Teléfono obligatorio sin ninguna explicación. El mismo formulario está duplicado 3+ veces en el home con IDs repetidos. Y lo más revelador: publican priceRange '$6500 - $11875' en el JSON-LD de LocalBusiness pero ese precio NO aparece en ninguna parte visible — se lo dan a Google y se lo esconden al cliente. Tampoco hay enlace a aviso de privacidad junto al formulario.

### EsBrillante — agencia de diseño (México)
<https://esbrillante.mx/>

Cero formulario en la home: el contacto es 'Teléfono y WhatsApp: 777 404 31 18' más un correo. La lada 777 es de Cuernavaca, aunque el sitio se posiciona como agencia nacional con presencia en CDMX. Prueba social no verificable: 'Más de 500 empresas en todo México ya confían en nosotros' sin un solo logo, caso o testimonio con nombre — exactamente el tipo de claim que NN/g documenta como generador de escepticismo.

### Clip México — home
<https://clip.mx/>

Bien: el precio se declara como comisión explícita con impuestos incluidos en la lectura, '2.99% + $1 + IVA', junto a '$0.00 Libre de cargos adicionales' — transparencia fiscal, que es justo lo que una PyME mexicana teme. Mal, y es un defecto real observado en el HTML servido: la burbuja flotante de WhatsApp del sitio mexicano apunta a wa.me/56984723100, un número de Chile (+56). El canal de contacto principal del país está roto en el sitio de un jugador grande.

### Alegra México — página de precios
<https://www.alegra.com/mexico/precios/>

Precios exactos en pesos y visibles (MXN 104/mes, con ancla tachada de MXN 138), 'Prueba gratis 15 días, sin tarjeta', y sobre todo un selector que auto-califica al usuario por uso, no por presupuesto: 'Elige según cuántos tickets vendes al mes y cuántas cajas necesitas'. El usuario se segmenta solo, sin que nadie le pregunte cuánto puede pagar. Además tienen horarios de atención por WhatsApp definidos por país (México L-V 8:00 a 17:30) codificados en el sitio.

### Basecamp — página de precios
<https://basecamp.com/pricing>

Dos patrones de reducción de incertidumbre sin manipulación. Primero, etiquetas de ayuda sobre los planes: 'Not sure? Start here' en el plan intermedio y 'The sweet spot' en el siguiente — resuelven la parálisis de elección sin presionar. Segundo, texto literal contra los dark patterns de retención: 'Risk-free, cancel anytime, no long-term lock-in… cancellation is entirely self-serve, no questions asked, no retention specialists trying to talk you out of it.' Prueba de 30 días.

### Designjoy — estudio de una sola persona con precio público
<https://www.designjoy.co/>

El comparable más cercano a Morphiq en modelo (una persona, suscripción). Precio público y grande: $4,995/month tachando $5,995. Honesto en lo importante: 'Pause or cancel anytime' repetido, y un FAQ que dice sin rodeos que no hay reembolsos pasada la primera semana. Pero el 'Lifetime Discount - Limited Time' está hardcodeado en el HTML de la página permanente: urgencia falsa permanente, que es el dark pattern suave más común en sitios de servicios. Copiar el precio público y la política de cancelación; no copiar el contador de urgencia.

### Zoho CRM (es-xl) — precios
<https://www.zoho.com/es-xl/crm/zohocrm-pricing.html>

El benchmark contra el que un prospecto va a comparar los $3,000/mes de CRM de Morphiq. Precio por usuario/mes con facturación anual, selector de moneda que incluye MXN, y el propio title dice 'Gratis para 3 usuarios'. Todo autoservicio, sin hablar con nadie. Implicación directa: si Morphiq no explica qué incluye su precio (implementación, migración, capacitación, soporte en español, personalización), el prospecto lee '$3,000/mes' contra 'gratis' y se va.

### LFPDPPP — requisitos del aviso de privacidad en México
<https://www.legiscope.com/blog/aviso-privacidad-mexico-lfpdppp.html>

La nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares se publicó el 20 de marzo de 2025 y entró en vigor al día siguiente. Siete elementos mínimos del aviso (identidad y domicilio, datos tratados, finalidades distinguiendo necesarias de voluntarias, medios para limitar uso, derechos ARCO, transferencias, procedimiento de cambios). Clave para CRO: para datos ordinarios de contacto el consentimiento es TÁCITO si el aviso está disponible en el punto de recolección — basta un enlace visible en el formulario, no hace falta checkbox obligatorio. El expreso se reserva a datos financieros/patrimoniales y el escrito a datos sensibles.

### Sitios que no pude inspeccionar (reportado por honestidad)
<https://thoughtbot.com/hire-us>

Tres fallos de carga que conviene registrar: thoughtbot.com/hire-us renderiza su formulario con JS y el HTML servido no contiene ni un solo campo, así que no pude auditarlo; clay.global/contact resultó no tener formulario, solo correo (hey@clay.global) y teléfono; bind.com.mx/precios devuelve una pantalla de verificación anti-bot; y softrestaurant.com falla la verificación TLS desde este entorno. En los cuatro casos sustituí por otras fuentes en lugar de describir de memoria.

---

# Síntesis de dirección de producto — rediseño multipágina de Morphiq

> Estado real del repo al escribir esto (verificado, no supuesto): el multipágina ya existe (`src/main.jsx` con `createBrowserRouter`, 11 rutas en `/home/user/MH-web-2.0/src/config/rutas.js`), el build ya escribe un HTML por ruta con su `title`, `canonical` y JSON-LD (`/home/user/MH-web-2.0/scripts/paginas-html.mjs`), y los precios ya viven en una fuente única (`/home/user/MH-web-2.0/src/config/pricing.js`). Varias "decisiones" de los frentes de investigación ya están hechas. Esta síntesis solo decide lo que falta y corrige lo que está mal.

---

## Qué hacen bien los demás y Morphiq debe adoptar

1. **Tabla de precios en la página de detalle Y el "desde $" ya en el hub** (Syllet acierta en lo primero y falla en lo segundo). El hub `/servicios` debe mostrar el precio de partida en cada tarjeta. Un clic extra para saber si te alcanza es un clic perdido.
2. **Rotular planes por tipo de negocio, no por features** (Bsale: "para empresas de servicios" / "que venden productos" / "que venden en muchos canales"; desarrollodepaginasweb: "Microempresa", "PyME"). El campo `paraQuien` de `pricing.js` ya existe: subirlo a la posición de subtítulo de la tarjeta, arriba de la lista de inclusiones.
3. **La fórmula completa del costo en la misma tarjeta** (Shopify POS: "Starting at $39/mo **+ $89/mo por cada sucursal POS Pro**"). Para Morphiq: `$3,000 MXN/mes + puesta en marcha desde $X (pago único)`. El flag `masImplementacion: true` ya está en el modelo de datos; falta que la UI lo imprima como número, no como nota.
4. **Compromisos de conducta en lugar de diagrama de fases** (Work & Co: "Small, senior teams", "Zero big reveals", "20 days to market feedback"). Es la credibilidad más barata que existe porque no requiere historial. La página `/proceso`—o el bloque de proceso dentro de `/sobre-morphiq`—debe listar 6 promesas falsables: *hablas con quien construye*, *precio cerrado antes de empezar*, *el dominio, el código y los accesos van a tu nombre desde el día uno*, *prototipo navegable en X días*, *respondo por WhatsApp en menos de 4 horas hábiles*, *sin presentaciones de relleno*.
5. **Portafolio en dos profundidades** (Clay: `/work` con 13 casos vs `/clients` con 30 líneas). `/proyectos` debe ser lista exhaustiva de una línea por cliente con etiquetas (Web / POS / CRM / Automatización) + 3 o 4 fichas completas. Mejor 4 casos honestos y 15 líneas que 15 casos a medias.
6. **La URL en vivo del proyecto como prueba** (Locomotive y Bakken & Bæck la publican siempre). Es lo único que Morphiq puede publicar hoy que ninguna agencia puede falsear y cualquiera puede auditar en dos segundos. Sustituye a los Awwwards que no tiene.
7. **Escenas operativas en el vocabulario del oficio** (Parrot: "trompo, plancha y bebidas trabajan en sincronía", "cada quien paga sus tacos"). Es la diferencia entre una página vertical y una lista de features con la palabra "restaurante" encima.
8. **El escalón cero gratuito** (Nei: menú QR $0 → Opera $1,197 → Administra $1,897 → Dirige $3,499 + $3,500 de implementación). El menú QR de Morphiq no es un producto de $2,000: es el gancho para entrar al restaurante y vender la web profesional, los pedidos por WhatsApp y el mantenimiento.
9. **La política de salida como argumento de venta** (Basecamp: "cancellation is entirely self-serve, no questions asked, no retention specialists"). Para un estudio de una persona es la respuesta directa a "¿y si mañana desapareces?".
10. **Segmentar por uso, no por presupuesto** (Alegra: "elige según cuántos tickets vendes al mes y cuántas cajas necesitas"). El prospecto se autoclasifica sin que nadie le pregunte cuánto puede pagar.
11. **Testimonios con nombre completo, puesto y negocio, o ninguno.** Los cinco estudios premium no tienen un solo testimonio anónimo. Si todavía no hay uno real, no hay sección de testimonios: los homes de Metalab y Bakken & Bæck funcionan sin ella.

## Qué hacen mal y Morphiq debe evitar

1. **El teatro del descuento en el piso del mercado.** paginaswebparapymes.com ya ocupa el $2,000 exacto con tachado 2,600→2,000 y "económicas y baratas" en el H1. Morphiq no compite ahí con el mismo número: la Web Esencial se reposiciona como **puerta de entrada a un ecosistema** (web hoy, punto de venta después), y su tarjeta cierra mostrando la ruta de upgrade con el precio de cada escalón.
2. **El multipágina nominal.** Creative Studio tiene sitio multipágina y su página de servicio apila 14 secciones, incluida "el costo de no tener presencia profesional". Regla dura: **cada página responde una pregunta y termina**. Si una página de servicio pasa de 7 bloques, se parte o se recorta. Replicar el scroll largo en 11 URLs no gana nada respecto a la página actual.
3. **El cargo de implementación sin cifra.** "Desde 3,000/mes + implementación" es exactamente lo que manda al prospecto a pedir otras tres cotizaciones — y el estándar que ya vio antes de llegar es setup 0 (Bind regala un mes de capacitación, Bsale no cobra puesta en marcha). Se corrige publicando el rango con lo que lo mueve, o absorbiéndolo con "puesta en marcha sin costo con 12 meses".
4. **Métricas de vanidad.** "1,650 proyectos", "19 años", "95% satisfacción", "+30% de ventas" sin fuente. Morphiq no puede ganar en volumen y un contador inflado se detecta al instante. `pricing.js` ya tiene escrita la regla ("Nada de métricas, uptime garantizado ni plazos que no se puedan sostener"): extenderla a todo el sitio.
5. **El CTA débil de los estudios premium.** Clay no tiene botón en el hero y su `/contact` es un correo y un teléfono. Es un lujo de quien recibe demanda sola. Morphiq copia a Locomotive y a Bakken & Bæck: CTA persistente, más WhatsApp visible en todas las páginas.
6. **El formulario de 10 campos con dropdown de presupuesto obligatorio.** Funciona a 300,000 MXN (BluePixel, Work & Co) y mata el lead a 5,000.
7. **El cotizador que entrega el estimado por correo** (New Emage). Gana el dato y anula la función del precio, que es dejar al prospecto decidir solo.
8. **El captcha matemático y el teléfono obligatorio sin explicar** (JuCri). Fricción máxima en el punto de menor compromiso.
9. **Dar el precio al buscador y esconderlo al cliente** (JuCri publica `priceRange: "$6500 - $11875"` en su JSON-LD y en la página visible solo dice "cotiza"). Es la peor combinación posible.
10. **El SPA sin HTML servido** (Metalab: el HTML del home contiene una frase y un `href="/"`). Morphiq depende de búsquedas locales; ese enfoque no es transferible.

## Decisiones de arquitectura de información

- **Navegación de 6, con PRECIOS dentro.** `Inicio / Servicios / Proyectos / Precios / Sobre Morphiq / Contacto` — ya es lo que hay en `MENU` de `rutas.js`. Se mantiene. Solo 1 de 7 competidores mexicanos tiene precios en el menú; es diferenciación gratis.
- **Los servicios se agrupan por situación del negocio, no por artefacto.** El hub `/servicios` no es una rejilla de cinco tarjetas iguales: son tres bloques —**Empieza tu presencia** (páginas web) / **Digitaliza tu operación** (punto de venta, sistemas) / **Automatiza y crece** (CRM, automatización, software a medida)— y dentro de cada uno cuelgan sus rutas con su "desde $". La ventaja real de Morphiq es que la misma persona hace la web, el POS y las automatizaciones; una lista plana la destruye.
- **`/soluciones/restaurantes` es página madre, no hoja.** Cuelgan de ella 3 sub-verticales antes de intentar cubrir todo: **taquería, cafetería, fonda/cocina económica**. Cada una con H1 literal ("Menú QR y pedidos por WhatsApp para taquerías") y 3-5 escenas operativas. Una sola página de "restaurantes" es la versión perezosa.
- **La home es distribuidor, no recorrido.** Ya está decidido así en `src/paginas/Inicio.jsx` y es correcto: cada bloque es un resumen con salida a su página. Ningún bloque de la home cuenta nada completo.
- **`/proceso` sube a primer nivel o vive como bloque ancla en `/sobre-morphiq`.** Prefiero lo segundo por ahora: 11 rutas ya son suficientes y `/sobre-morphiq` es donde se responde la objeción "es una sola persona". Si el bloque crece de 6 promesas, se independiza.
- **Objeción del freelancer, respondida de frente y con mecanismos.** Creative Studio publica una matriz "agencia vs freelancer vs plantillas" diseñada para matar a Morphiq. La respuesta no es esconder que es una persona: es un bloque en `/sobre-morphiq` titulado con la pregunta ("¿Qué pasa si desapareces?") y contestado con contrato, entrega de repositorio y credenciales a nombre del cliente, documentación escrita y tiempo de respuesta comprometido.
- **Separar páginas comerciales de páginas educativas.** `/servicios/sistemas` y `/servicios/crm-automatizacion` asumen intención de compra. "Qué es un CRM" y "qué es un punto de venta" son contenido de captación en `/recursos/*` que enlaza a las comerciales. Mezclarlos mata la conversión de una y el SEO de la otra. **No implementar `/recursos` en esta fase**: primero deben existir los casos reales.
- **Enlazado interno obligatorio:** las cinco rutas `/servicios/*` deben estar enlazadas desde el pie **y** desde el hub, no solo desde el desplegable del nav — los hijos del `Desplegable` en `Navegacion.jsx` solo existen en el DOM cuando alguien abre el menú.

## Decisiones de presentación de precios

- **Regla anti-cebo, sin excepción.** Ningún "desde" se publica solo. Cada uno lleva dos líneas pegadas: **"Desde $2,000 incluye:"** (entregable concreto) y **"Sube de precio si:"** (más secciones, textos por redactar, catálogo, pasarela de pago, migración). El modelo de datos ya tiene `incluye` / `noIncluye` / `puedeIncluir`; falta el campo **`subeSi`** y falta que la UI lo pinte al mismo nivel visual que las inclusiones, no en la nota.
- **Máximo 3 niveles visibles por línea de servicio.** Web: Esencial (desde $2,000) / Profesional (desde $8,000) / Ecosistema (piso publicado). Nunca seis paquetes diferenciados por "hasta N secciones": arriba de ~5 alternativas la gente deja de comparar atributos y empieza a eliminar por filtros.
- **El recurrente es una página de producto con precio, no una nota al pie.** Es el hueco estructural más grande de la muestra: los tres competidores que publican precios dicen "hosting y dominio incluidos el primer año" y dejan el año 2 sin número. El mensaje que nadie más puede dar: **"sabes exactamente lo que pagas el año 2"**. Mantenimiento desde $200/mes con qué incluye cada mes, y la línea explícita de qué pasa en el mes 13 con dominio y hosting **en la tarjeta**, no en el FAQ.
- **Publicar el rango de la puesta en marcha de POS/CRM.** Renombrarla "puesta en marcha", listar sus entregables uno por uno (carga de catálogo, alta de usuarios, capacitación, migración) y publicar el rango con lo que lo mueve: número de productos, sucursales y usuarios. Alternativa preferida si el número asusta: **"puesta en marcha sin costo si contratas 12 meses"**, que además ancla el plazo anual como hacen Alegra y Zoho.
- **3 a 5 proyectos reales con el monto que efectivamente se cobró**, con giro y ciudad aunque el cliente vaya anónimo. Es la recomendación textual de NN/g, lo ejecuta Bozh Studio y **nadie en el mercado mexicano lo hace**. Vale más que cualquier tabla de paquetes.
- **"Ecosistema" nunca dice "contactar para precio" a secas.** Publica piso ("proyectos desde $X MXN") más dos casos representativos con su monto. Un piso filtra al que no califica y evita que el que sí califica se vaya creyendo que es incosteable.
- **MXN e IVA declarados en la propia página de precios.** En México eso cambia el número final en 16%. Sin geodetección de moneda, sin conversión automática, sin USD — la página en español de Zoho me sirvió rupias.
- **Cada tarjeta cierra con la condición de salida:** plazo mínimo, cómo se cancela, y a quién pertenecen el dominio, el código y los datos.
- **Progressive disclosure de exactamente dos niveles.** Nivel 1 en la tarjeta: precio, una línea de alcance, add-on obligatorio si existe. Nivel 2 en acordeón en la **misma** página: qué incluye, qué no incluye, qué mueve el precio. Nunca una tercera página para saber el costo real.

## Decisiones de copy y tono

- **Hero literal, 3 a 15 palabras, con el cómo en el subtítulo.** "Morphiq construye páginas, puntos de venta y sistemas para negocios en la Ciudad de México." Prohibido: "transformamos tu negocio digitalmente", "construimos el futuro digital", "impulsamos tu presencia en línea". El copy de hero de 5 de los 7 competidores mexicanos es intercambiable entre ellos; esa es la vara.
- **Abrir con el dolor citado en primera persona del dueño, no con el beneficio.** Nei lo hace con "¿Me estarán robando?" / "Si no estoy, no sé qué pasa". Las de Morphiq, por vertical: *"¿Cuánto me está costando Rappi este mes?"*, *"Cambié precios y el menú impreso sigue mal"*, *"Cotizo por WhatsApp y se me pierden las conversaciones"*.
- **Nombrar el enemigo con número.** Comisiones de Rappi/UberEats/DiDi entre 25% y 35%. La oferta se enmarca como recuperar margen que hoy se va a un tercero, no como comprar software.
- **El alcance se escribe en verbos de entrega, no en categorías.** "Carga de tu catálogo completo y capacitación de tus cajeros en sitio" en vez de "implementación profesional".
- **Los encabezados de un caso son decisiones, no fases.** "Por qué el catálogo va en una sola página", "Cómo se factura desde el punto de venta". Ninguno de los cinco estudios premium usa "Reto / Solución / Resultado".
- **Miguel con nombre, cara y año.** Locomotive nombra a 20 personas con su rol y su año de entrada; Morphiq nombra a 1 con el suyo. Es verificable, es gratis y es la ventaja frente a agencias anónimas.
- **Bajo confidencialidad se describe sin nombrar, nunca se inventa.** "Una cadena de cafeterías en CDMX" o "Confidencial" se leen como honestidad.
- **La personalidad se confina a un contenedor.** Un bloque "Cómo trabajo" o `/notas`. Las páginas de servicio, de precios y de caso quedan sobrias.
- **Bloque de honestidad competitiva en `/servicios/sistemas`:** *"Si ya facturas más de X o tienes varias sucursales, probablemente necesitas Parrot o Soft Restaurant, no a mí."* Filtra prospectos malos, que es lo que más caro le sale a un estudio de una persona, y compra credibilidad para todo lo demás.

## Decisiones de SEO técnico (con URLs oficiales)

1. **Mantener el prerender de `head` por ruta y no fingir que es más de lo que es.** `scripts/paginas-html.mjs` ya escribe `title`, `description`, `canonical`, OG y JSON-LD reales por URL, más un `<noscript>` con enlaces `<a href>` de verdad. Eso resuelve el problema de las 11 URLs con el mismo `title` y el canonical fijo a la home. El cuerpo sigue siendo CSR: es aceptable —Google renderiza JS— pero la meta a medio plazo es HTML estático completo, que es lo que Google recomienda desde que retiró el renderizado dinámico. https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering · https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
2. **Reescribir `/home/user/MH-web-2.0/src/components/layout/Footer.jsx`.** Hoy sigue siendo el del sitio de una página: usa `FOOTER.links` con anclas (`#servicios`, `#trabajo`, `#inversion`…) y `href="#inicio"`, que en `/precios` no llevan a ningún lado. Debe enlazar las 11 rutas con `<Link>` de react-router, con texto que describa el destino. Es la forma más barata de que ninguna página quede huérfana. https://developers.google.com/search/docs/crawling-indexing/links-crawlable · https://developers.google.com/search/docs/fundamentals/seo-starter-guide
3. **Quitar `<priority>` y `<changefreq>` de `scripts/sitemap.mjs` y borrar la constante `PRIORIDAD` de `rutas.js`.** Google los ignora, literal. Y el `lastmod` global del último commit estampado en las 15 URLs es justo el patrón que Google descarta por no ser verificable por página: o se calcula por archivo de contenido (`git log -1 --format=%cs -- src/content/servicios.js`) o se omite. https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
4. **Mover el bloque `Organization` + `Person` de `index.html` a la home y `/sobre-morphiq`.** Hoy se sirve en las 11 rutas sin aportar nada fuera de la home. `WebSite` sí se queda en la raíz: es requisito de colocación para el nombre del sitio. https://developers.google.com/search/docs/appearance/structured-data/organization · https://developers.google.com/search/docs/appearance/site-names
5. **Decidir la dirección postal.** `LocalBusiness` exige `name` y `address`; el JSON-LD llega a "Xochimilco, Ciudad de México, MX" sin calle. O se completa, o se asume que la ficha local queda incompleta y se compensa con Google Business Profile. **No se inventa una calle**: la marcación tiene que ser representación verdadera del contenido. https://developers.google.com/search/docs/appearance/structured-data/local-business · https://developers.google.com/search/docs/appearance/structured-data/sd-policies
6. **No esperar nada del nodo `Service` ni del `FAQPage`.** No existe tipo "Service" en la galería de resultados enriquecidos, y el resultado enriquecido de FAQ se retiró de Search y su documentación se eliminó en junio de 2026. Ambos se pueden mantener por precisión semántica, pero **el FAQ de cada página de servicio se justifica por conversión, jamás por "ganar espacio en la SERP"**. La apuesta documentada es `Organization` + `LocalBusiness` + `BreadcrumbList`, y ese trío hay que dejarlo impecable. https://developers.google.com/search/docs/appearance/structured-data/search-gallery · https://developers.google.com/search/docs/appearance/structured-data/faqpage · https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
7. **Verificar en producción que una URL inexistente devuelve 404 real.** El build ya escribe `dist/404.html` con `noindex, follow` y limpia las meta `robots` contradictorias — está bien resuelto —, pero con `framework: vite` y `cleanUrls` en `vercel.json` hay que comprobar con la Inspección de URLs que el estado HTTP es 404 y no 200 con el shell. https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
8. **Prohibición explícita: cero páginas por alcaldía.** Clonar `/servicios/paginas-web` en variantes Coyoacán / Iztapalapa / Benito Juárez es el ejemplo textual de *doorway abuse*, y clonar plantillas es *scaled content abuse*. `/soluciones/restaurantes/taqueria` es defendible porque cambia el problema, el vocabulario y el precio; una por colonia no lo sería. https://developers.google.com/search/docs/essentials/spam-policies
9. **`title` y `description` únicos por ruta, con dato concreto (precio de partida, ciudad, tipo de negocio), y aceptar que Google puede reescribirlos.** No hay límite oficial de 60 caracteres: el truncado es visual. Las descriptions que son cadenas de keywords tienen menos probabilidad de usarse. https://developers.google.com/search/docs/appearance/title-link · https://developers.google.com/search/docs/appearance/snippet
10. **Firmar el contenido con Miguel** y enlazar desde cada página de servicio a `/sobre-morphiq`. Google pregunta explícitamente si el autor es evidente, si el byline lleva a más información sobre él y si el contenido demuestra experiencia de primera mano. https://developers.google.com/search/docs/fundamentals/creating-helpful-content
11. **Borrar el código muerto que crea dos verdades:** `/home/user/MH-web-2.0/src/App.jsx` (la app de una sola página, ya no la importa nadie) y `src/components/layout/Navigation.jsx`. Mientras existan, cualquiera puede editar el footer o el nav equivocado.
12. **Calibrar expectativas con el cliente citando a Google:** los efectos pueden tardar de horas a varios meses, y conviene esperar semanas antes de evaluar. https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Decisiones de responsive y performance (con umbrales numéricos)

- **Objetivo, no negociable: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, al percentil 75, segmentado móvil y escritorio.** Las tres a la vez. Un 100 en Lighthouse no equivale a aprobar Core Web Vitals. https://web.dev/articles/vitals
- **Presupuesto de LCP por plantilla, repartido:** TTFB ≈ 40% (≤ 1.0 s), *resource load delay* < 10% (≤ 250 ms), descarga ≈ 40% (≤ 1.0 s), *render delay* < 10% (≤ 250 ms). https://web.dev/articles/optimize-lcp
- **El `BootLoader` solo en `/`.** Hoy `Layout.jsx` lo muestra una vez por sesión en **cualquier** ruta de entrada: quien llega desde Google a `/precios` recibe un velo a pantalla completa antes del contenido. Eso *es* el LCP. Decisión: pantalla de arranque exclusiva de la home, y desactivada con `prefers-reduced-motion: reduce`.
- **Partir el bundle por ruta.** `src/paginas/Inicio.jsx` importa `Logo3D` de forma estática y `main.jsx` importa las nueve páginas de forma estática: **three.js viaja a `/precios` y a `/contacto` aunque no se use**. `React.lazy` en las rutas + `lazy` en `Logo3D`, y la escena 3D se paga solo en la home, que no es donde se decide la venta.
- **`lenis` fuera de las páginas que venden.** El scroll suave mantiene un `requestAnimationFrame` vivo compitiendo por el hilo principal. Se queda —si acaso— en la home; en `/precios`, `/servicios/*` y `/contacto` no aporta nada y sí cuesta.
- **Reset base obligatorio en `src/styles/base.css`:** `img,video,iframe{max-inline-size:100%; block-size:auto}` más `width` y `height` en cada `<img>`. Elimina de raíz la causa número uno de CLS. https://web.dev/articles/optimize-cls · https://web.dev/learn/design/responsive-images
- **El hero de cada ruta es recurso crítico:** `loading="eager" fetchpriority="high"` en el HTML, nunca `background-image` de CSS ni lazy-load — el preload scanner no descubre las imágenes de fondo. `index.html` ya precarga los lockups; hay que replicar el criterio por plantilla.
- **Tipografía fluida con una sola fórmula en `tokens.css`,** del tipo `clamp(1rem, 0.95rem + 0.35vw, 1.15rem)`, **respetando máximo ≤ 2.5× el mínimo** para no fallar WCAG 1.4.4. Validar con zoom al 200% y ancho de 320 px antes de cerrar el diseño. https://web.dev/articles/baseline-in-action-fluid-type · https://web.dev/articles/min-max-clamp
- **CTAs a 48×48 px reales con 8 px de separación**, con `@media (any-pointer: coarse){ padding extra }`. Aplica al botón flotante de WhatsApp, al de llamar y a los enlaces del pie. Es el número más repetido en toda la documentación de Google y el que más leads recupera en tráfico mexicano de PyME, que es abrumadoramente móvil. https://web.dev/articles/accessible-tap-targets · https://developer.chrome.com/docs/lighthouse/seo/tap-targets
- **Animación opt-in, no opt-out:** todo lo decorativo dentro de `@media (prefers-reduced-motion: no-preference)`, y animar únicamente `transform` y `opacity` — son las únicas compositadas que no cuentan para CLS. Nada de parallax en el hero. El repo ya tiene `useReducedMotion`; la regla debe estar además en CSS, no solo en JS. https://web.dev/articles/prefers-reduced-motion
- **Auditar la paleta antes de maquetar ocho páginas:** 4.5:1 en texto normal, 3:1 en texto grande (≥ 18 pt/24 px, o 14 pt/18.5 px en negrita) e iconos esenciales. Rehacerla después cuesta diez veces más. https://web.dev/learn/accessibility/color-contrast
- **Reservar espacio con `aspect-ratio` o `min-height` para todo lo de terceros** (mapa, widget de WhatsApp, reseñas). Segunda fuente de CLS en sitios de PyME.
- **Medir en campo, no en laboratorio.** `@vercel/speed-insights` ya está instalado: eso convierte el mantenimiento de $200/mes en un entregable defendible —reporte mensual con LCP, INP y CLS al p75 contra su umbral— en vez de una cuota difusa de soporte.
- **No prometer nunca el criterio de 12 px / 60% de Lighthouse:** está deprecado desde Lighthouse 13. https://developer.chrome.com/docs/lighthouse/seo/font-size

## Decisiones de formulario y CRO

- **Cuatro obligatorios, tres opcionales.** El formulario de `src/paginas/Contacto.jsx` ya tiene la forma correcta (nombre, negocio, teléfono, correo, servicio, mensaje, presupuesto). Falta: marcar con asterisco los obligatorios **y** escribir "(opcional)" en los opcionales — solo el 14% de los sitios lo hace y no ha mejorado en una década. Presupuesto y "cuándo quieres empezar" son opcionales, siempre con la opción **"Aún no sé"**.
- **Una sola columna.** Hoy teléfono y correo van en pareja (`__duo`): es la excepción admisible sólo si se leen como una misma entidad ("cómo te contacto"). Si genera saltos de campo en pruebas, se separa. Los formularios a dos columnas hacen que la gente omita campos obligatorios.
- **Justificar el teléfono en una línea pegada al campo:** *"Para responderte por WhatsApp el mismo día. No te llamo sin avisar."* 14% se niega a dar su teléfono y 39% de los sitios no explican por qué lo piden.
- **Cero captcha.** Honeypot invisible + límite de envíos por IP en el servidor. El captcha matemático de JuCri es fricción visible en el punto de menor compromiso del embudo.
- **Validación en `blur`, nunca mientras se escribe;** una vez que hay error, revalidar en cada tecla para que desaparezca al corregir; palomita verde en los válidos. Conservar siempre lo ya escrito al fallar el envío.
- **Promesa de respuesta escrita arriba del botón y cumplida:** *"Te respondo por WhatsApp en menos de 4 horas hábiles — lunes a viernes, 9:00 a 19:00, hora CDMX."* Responder en minutos donde una agencia tarda días es la ventaja estructural de un estudio de una persona, no un detalle operativo.
- **Botón específico, no genérico.** "Pedir cotización sin costo" o "Agendar 15 minutos". Prohibidos "Empezar", "Más información" y "Cotiza tu proyecto": un CTA genérico canibaliza clics del contenido que el usuario sí necesitaba y crea ilusión de completitud.
- **Un CTA distinto por página:** en `/servicios/paginas-web` → "Ver precios de páginas web"; en `/servicios/sistemas` → "Agendar demo de 15 min"; al final de un caso → "Quiero algo así para mi negocio".
- **Agenda propia además de WhatsApp.** Magokoro es el único de la muestra con "Agendar" y nadie en el rango PyME lo tiene. Un link de calendario para 15 minutos es diferenciación barata.
- **Página de gracias que diga qué pasa después, quién contesta y en cuánto** — no "Gracias, nos pondremos en contacto".
- **WhatsApp con mensaje precargado por página** (ya resuelto en `src/lib/whatsapp.js` con `WHATSAPP_MESSAGES` por origen; extenderlo a las rutas nuevas). **Verificar el número en cada página antes de publicar**: Clip México, con todo su presupuesto, tiene la burbuja de WhatsApp apuntando a un número de Chile.
- **Aviso de privacidad enlazado junto al botón, sin checkbox obligatorio.** Para datos de contacto ordinarios la LFPDPPP vigente desde el 21 de marzo de 2025 admite consentimiento tácito si el aviso está disponible en el punto de recolección; el checkbox solo suma fricción sin sumar cumplimiento.
- **Bug a corregir en `Footer.jsx`:** el correo enlaza a `https://mail.google.com/mail/?view=cm&fs=1&to=…`, lo que fuerza Gmail web y rompe para quien usa Outlook o el cliente del teléfono. Debe ser `mailto:`.
- **Instrumentar antes de opinar:** tasa de inicio del formulario, abandono campo por campo y tiempo hasta la primera respuesta. Los estudios públicos sobre longitud se contradicen entre sí (quitar campos hundió la conversión 14% en un test, añadirlos la subió 109% en otro): sin datos propios, cualquier decisión sobre longitud es fe.

## Riesgos y trampas a evitar

1. **El bait-and-switch del "desde".** El daño no lo causa el "desde", lo causa el cargo obligatorio revelado tarde: HubSpot muestra "$7/mo/seat" y cobra $3,000 de onboarding que solo aparece en el checkout, y es su queja de precio más citada. Si Morphiq no puede escribir la línea "sube de precio si:" para un servicio, **ese servicio todavía no está listo para publicarse con precio**.
2. **Que el $2,000 no sea un entregable real.** Un ancla baja con lista de inclusiones inflada —como el "desde $990" con hosting, 10 correos, SEO y blog que hay en el mercado— destruye la credibilidad de toda la página de precios. Auditar que la Web Esencial sea exactamente lo que alguien ya compró.
3. **Cobrar por el menú QR.** Es competir contra el plan gratis de Nei y contra OlaClick a 8 USD. Se regala y se monetiza lo que viene después.
4. **Construir contenido sobre el resultado enriquecido de FAQ.** Ya no existe. Cualquier plan que dependa de "poner FAQs para ganar espacio en la SERP" está construido sobre una función retirada.
5. **La fábrica de páginas por alcaldía o por keyword.** Está nombrada como infracción, no como zona gris.
6. **Prometer números de rendimiento en propuestas.** Nada de "+30% de ventas" ni "PageSpeed 100". Se prometen umbrales medibles (LCP/INP/CLS al p75) y se reportan mensualmente.
7. **Urgencia falsa permanente.** Un "Oferta por tiempo limitado" hardcodeado en una página fija (Designjoy) es el dark pattern suave más común en sitios de servicios honestos por lo demás. Prohibido, junto con casillas de marketing premarcadas y confirmshaming en popups.
8. **Dos fuentes de verdad en el código.** Mientras `src/App.jsx` y `Navigation.jsx` sigan en el repo, alguien va a editar el footer equivocado y el sitio va a publicar anclas rotas. Borrarlos ahora, antes de sumar páginas.
9. **El desplegable de Servicios como único enlace a `/servicios/*`.** Googlebot no hace clic; los cinco enlaces tienen que existir también en el pie y en el hub.
10. **Complejidad tipo Alegra.** 4 productos × 4 planes = 16 SKUs convierten la página de precios en un examen. Morphiq no debe pasar de 3 niveles visibles por línea.
11. **Un `<noscript>` que se desincroniza del contenido real.** `paginas-html.mjs` lo genera desde los mismos módulos que la web, que es lo correcto — pero cualquier bloque escrito a mano ahí se convierte en deuda invisible. Regla: nada de texto literal nuevo en el generador que no venga de `src/content/*`.
12. **Convertir el multipágina en once scrolls largos.** Es el riesgo número uno del proyecto y no es técnico: es de disciplina editorial. Si `/servicios/paginas-web` termina con 14 bloques, el rediseño no ganó nada frente a la página que Morphiq ya tenía.

---

## Qué de todo esto se implementó en este Preview

| Hallazgo | Dónde vive ahora |
| --- | --- |
| «Sube de precio si», al mismo nivel que las inclusiones | `src/config/pricing.js` → campo `subeSi`, pintado en `TarjetaPlan` |
| Condiciones de salida por tarjeta (permanencia, propiedad) | `pricing.js` → campo `salida` |
| IVA declarado en la página de precios | `pricing.js` → `AVISO_IVA`, mostrado en `/precios` |
| Máximo 3 niveles visibles por familia | `/precios` con selector de familia |
| Revelación progresiva de dos niveles, sin tercera página | `/precios` y acordeones en cada página de servicio |
| Explicar CRM y POS desde el problema, no desde la función | `content/servicios.js`, bloques `quees` y `problemas` |
| Pantalla de arranque solo en la home | `components/layout/Layout.jsx` |
| Bundle partido por ruta | `src/main.jsx` con `React.lazy` |
| 48px de objetivo táctil en punteros gruesos | `styles/sitio.css`, `@media (any-pointer: coarse)` |
| Suelo de 12.5px en tipografía | `styles/sitio.css` |
| Un HTML real por ruta con su title y su canonical | `scripts/paginas-html.mjs` |
| Migas en JSON-LD | `lib/seo.jsx` → `nodoMigas` |
| Formulario corto: solo nombre y mensaje obligatorios | `paginas/Contacto.jsx` |
| Rango de presupuesto opcional y sin castigo | `paginas/Contacto.jsx` |

## Qué NO se implementó, y por qué

- **Publicar el monto real cobrado en 3-5 proyectos.** Es la recomendación
  más fuerte de la investigación y nadie en el mercado mexicano lo hace,
  pero requiere que Miguel decida qué cifras puede publicar y con qué
  permiso del cliente. Queda como decisión suya después del Preview.
- **«Puesta en marcha sin costo si contratas 12 meses».** Ancla el plazo
  anual y quita la fricción del pago inicial, pero es una decisión
  comercial con consecuencias de caja. No se toma por él.
- **Rango publicado de la puesta en marcha de POS y CRM.** Mismo motivo:
  hace falta que Miguel confirme el rango real.
- **Reservar una llamada con calendario.** Solo un competidor lo ofrece y
  es una ventaja clara, pero implica conectar una herramienta externa.
