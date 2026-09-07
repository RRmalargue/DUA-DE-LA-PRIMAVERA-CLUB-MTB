# Portal de Inscripción Configurable - Trail Running

¡El desarrollo del portal interactivo de inscripciones ha sido completado con éxito! Se ha implementado una solución premium con arquitectura modular y de alto impacto visual.

## Arquitectura de Archivos en el Espacio de Trabajo

El proyecto ha sido estructurado en la carpeta:
`C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/`

Los archivos creados son:
1. [**`config.json`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/config.json): Archivo JSON central que define las distancias, categorías, precios y URLs de imágenes.
2. [**`index.html`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/index.html): El portal público para los atletas. Incluye el asistente (wizard) interactivo de 3 pasos.
3. [**`index.css`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/index.css): La hoja de estilos compartida con estética oscura premium, glassmorphism, sombras de neón y diseño 100% móvil-responsivo.
4. [**`app.js`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/app.js): Lógica del frontend (cálculo de edad y categorías en tiempo real, validación estricta de CUIL a 11 dígitos, conversión de archivos a Base64 y envío al backend).
5. [**`admin.html`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/admin.html): El panel de administración para reconfigurar carreras de manera gráfica.
6. [**`admin.js`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/admin.js): Lógica del panel de administración que carga la configuración y descarga el archivo JSON.
7. [**`google-apps-script.js`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/google-apps-script.js): Código del backend para instalar en Google Sheets.
8. [**`assets/trail_background.jpg`**](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/assets/trail_background.jpg): Imagen de fondo generada con Inteligencia Artificial.

---

## Captura del Fondo de Pantalla Generado

A continuación se muestra el fondo deportivo premium generado para el portal:

<img src="/C:/Users/Usuario/.gemini/antigravity/brain/b8ea5ccc-0d18-4d94-8847-f3e02d2fd435/trail_background_1786203822146.jpg" alt="Fondo Deportivo Trail Running" style="max-width: 100%; border-radius: 8px;" />

---

## Características de la Implementación

### 1. Panel de Administración Reutilizable (`admin.html`)
El portal es 100% dinámico. El panel de administración permite al organizador:
- Cambiar el nombre de la carrera.
- Establecer las distancias disponibles (se configuró por defecto **5K** y **15K**).
- Modificar los costos de inscripción correspondientes.
- Configurar las categorías de edad. Se incluye un botón **"Cargar Estándar"** para auto-rellenar rangos recomendados (18-29, 30-39, 40-49, 50-59, 60+).
- Cargar enlaces a mapas GPX/KML, punto de largada en Google Maps y afiche de carrera.
- **Exportar en Caliente**: Al terminar, el botón **Descargar config.json** genera el archivo listo para sobrescribir en el proyecto, actualizando el portal de inmediato sin tocar una sola línea de código HTML.

### 2. Formulario de Inscripción Inteligente (`index.html` / `app.js`)
- **Validación de CUIL**: Se restringe la entrada únicamente a números y se valida de forma estricta que contenga exactamente 11 dígitos.
- **Cálculo de Edad y Categoría en Tiempo Real**: Al seleccionar la fecha de nacimiento, el sistema calcula la edad actual del corredor y busca automáticamente a qué rango de categoría pertenece según la configuración del `config.json`, bloqueando la inscripción de menores de 18 años.
- **Subida Obligatoria de Comprobante**: El paso 3 (Pago) bloquea el botón "Confirmar Inscripción" hasta que el corredor adjunte el archivo de transferencia. Soporta arrastrar y soltar (Drag & Drop) y valida extensiones permitidas (JPG, PNG, PDF) con un límite de 5MB.
- **Simulación Local / Modo Demo**: Si el script de Google Sheets no está enlazado aún, el formulario opera en modo de simulación, mostrando una pantalla de carga y de éxito interactiva e imprimiendo los datos que se enviarían directamente en la consola del navegador.

---

## Guía de Conexión a Google Sheets y Google Drive

Sigue estos sencillos pasos para conectar el formulario a tu hoja de cálculo:

1. Abre tu cuenta de Google Drive y crea una nueva **Google Sheet (Hoja de cálculo)**.
2. En la barra superior de la hoja, dirígete a **Extensiones** ➔ **Apps Script**.
3. Borra todo el código predeterminado en el editor y pega el contenido del archivo [`google-apps-script.js`](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/google-apps-script.js).
4. Guarda el archivo haciendo clic en el icono del **Disco**.
5. Haz clic en el botón azul **Implementar** (esquina superior derecha) ➔ **Nueva implementación**.
6. Haz clic en el icono de la engranaje (Tipo) y selecciona **Aplicación web**.
7. Rellena los datos:
   - **Descripción**: `Conector Formulario Trail`
   - **Ejecutar como**: `Yo (tu-correo@gmail.com)`
   - **Quién tiene acceso**: `Cualquiera` (Esto es muy importante para que el formulario web de los atletas pueda enviar los datos).
8. Presiona **Implementar**.
9. Otorga los permisos necesarios cuando Google te lo solicite ("Autorizar acceso" ➔ elige tu cuenta ➔ "Configuración avanzada" ➔ "Ir a Proyecto sin nombre (no seguro)" ➔ "Permitir").
10. Copia la **URL de la aplicación web** generada (ej: `https://script.google.com/macros/s/AKfycb.../exec`).
11. Abre el archivo [`app.js`](file:///C:/Users/Usuario/.gemini/antigravity/scratch/trail-registration-portal/app.js) en tu editor y en la **línea 9** reemplaza `'TU_SCRIPT_URL_AQUI'` por la URL que acabas de copiar:
    ```javascript
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
    ```
12. Guarda el archivo `app.js`. ¡El sistema ya guardará las filas en tu planilla y creará una carpeta en Google Drive llamada `Comprobantes_[Nombre_de_la_Carrera]` con los archivos adjuntos!

---

## Nuevas Características de la Segunda Fase (Actualización)

Se ha implementado una gran cantidad de características avanzadas y mejoras de usabilidad solicitadas por el organizador:

### 1. Sistema de Carga de Archivos Local (CMS Integrado)
* **API POST `/api/upload-file`**: Se añadió soporte en `server.js` para recibir archivos pesados (afiches, remeras, altimetrías, GPX y KML) codificados en Base64 y guardarlos de forma automatizada en el disco del servidor (carpeta `IMAGENES`).
* **Botones "Subir"**: Todos los inputs de ruta en `admin.html` tienen ahora un botón gris de "Subir" que dispara la subida con un clic y completa la ruta autogenerada.

### 2. Edición Avanzada de Distancias y Costos
* **CRUD de Distancias**: La tabla de distancias ahora cuenta con botones de **Editar (Lápiz celeste)** y **Eliminar (Basurero)** en cada fila.
* **Modo Edición**: Al hacer clic en el lápiz, la distancia se carga en el formulario (Código, Nombre, Precio, Detalle, GPX e Imagen de altimetría específica). El botón cambia a "Guardar Cambios" y se habilita la opción de subir o modificar tanto el GPX como el perfil de altura de esa distancia en particular.
* **Altimetría Dinámica en Portal Público**: Cuando un corredor selecciona una distancia, el portal público carga y muestra de forma dinámica la imagen de altimetría de esa distancia. Si la distancia no tiene un mapa de altura específico configurado, el sistema retrocede automáticamente y muestra la imagen de altimetría global configurada para toda la carrera.

### 3. Mapa de Largada y Trazador de Rutas
* **Bloqueo de Marcador**: Se implementó una casilla de verificación `🔒 Bloquear posición del marcador de Largada`. Cuando está tildada, evita clics o arrastres accidentales del marcador de largada mientras se arrastra el mapa para explorar el terreno.
* **Buscador de Ubicación (Celeste)**: Se integró una barra de búsqueda única que permite escribir un lugar (ej: *Las Leñas*) y presionar `Buscar e Ir` para teletransportar el mapa y ubicar la largada al instante.
* **Trazado de Ruta a Ciudad (Naranja)**: Permite escribir el nombre de la ciudad más cercana (ej: *Malargüe*) y calcular la ruta por carretera real usando la API libre de OSRM, dibujando el trayecto en el mapa y mostrando la distancia exacta en kilómetros.
* **Redirección a Google Maps**: Se colocó un enlace dinámico `🔗 Ver` al lado del campo de texto de largada y un gran botón destacado color verde neón `ABRIR RUTA EN GOOGLE MAPS` debajo del mapa. Al hacerles clic, abren la coordenada o el trayecto exacto en la aplicación oficial de Google Maps en una pestaña nueva para seguir el recorrido.

### 4. Categorización Automatizada de 5K Libre
* **Filtros por Distancia**: En `app.js` se optimizó la función `determineCategory` para dar prioridad absoluta a categorías específicas de 5K (como `5 KMS LIBRE DAMAS` y `5 KMS LIBRE CABALLEROS`) si la distancia elegida es 5K, ignorando los rangos de edad genéricos de la distancia mayor (15K).

### 5. Personalizador Dinámico de Temas de Color y Fondos de Montaña (CMS Estético)
* **Paleta de Colores**: El panel de administración cuenta con 5 botones de colores (**Naranja Fuego, Verde Bosque, Azul Glaciar, Rojo Volcán y Púrpura Neón**) para cambiar la acentuación de botones y elementos visuales.
* **Selector de Fondos de Paisaje**: Se agregaron 4 opciones de fondos de pantalla panorámicos premium de montaña (**Bosque Verde, Nieve/Alta Montaña, Atardecer Dorado y Valle Rocoso**) generados por IA.
* **Cambio en Tiempo Real**: Al hacer clic en los botones en el panel administrativo, tanto el color como el fondo se aplican de inmediato en la pantalla.
* **Persistencia y Cero Parpadeo**: La selección se guarda en `config.js` (`themeColors` y `themeBackground`). Ambas páginas cargan un script en línea ultrarrápido al inicio del `<body>` que inyecta los colores y el fondo antes de renderizar la página, eliminando cualquier tipo de parpadeo visual molesto.

### 6. Despliegue Permanente en GitHub Pages
* Se implementó el soporte para alojar todos los recursos estáticos del formulario de forma permanente, segura y 24/7/365 en **GitHub Pages**, a coste cero para el organizador.

### 7. Reestructuración Visual de la Página Principal (Layout de Embudo)
* **Afiche en la Cabecera**: El afiche principal de la carrera ahora es completamente visible por defecto al inicio de la página, sirviendo como banner de presentación de alto impacto.
* **Logo de Carrera en Cabecera**: Se integró un contenedor flotante arriba a la derecha en la sección hero para el Logo Oficial de la carrera, adaptándose automáticamente a pantallas móviles centrándose y escalando para evitar superposiciones con los textos.
* **Caja de Información de la Carrera**: Se integró un box de descripción que carga un texto descriptivo dinámico y que puede ser editado y actualizado directamente desde el Panel de Administración.
* **Dashboard Interactivo de Distancias**: Un panel unificado que agrupa:
  - El selector de distancias (Tarjetas interactivas).
  - Los detalles, hitos y costos de la distancia elegida.
  - Los botones de descarga de tracks (GPX, KML) y largada en Google Maps.
  - El mapa Leaflet interactivo de recorrido y la altimetría dinámicos de esa distancia.
* **Acceso Guiado a Inscripción**: Al seleccionar una distancia en el dashboard, se habilita un gran botón destacado para "Iniciar Inscripción". Al hacer clic, se revela el formulario de registro en la parte inferior con una transición y un desplazamiento suave, enfocando el campo de Nombre con la distancia elegida pre-cargada de forma transparente para evitar errores de selección.

### 8. Integración con Google Sheets - Nuevas Columnas y Lógica Condicional
* **Columna Género**: Se añadió el parámetro `genero` al envío de datos y al script `google-apps-script.js`, registrando si el corredor es Dama o Caballero.
* **Columna Opcional "Team o Lugar de Origen"**: Se integró un nuevo campo de texto opcional en el formulario público. Los datos se envían a la planilla y se mapean en la nueva columna "Team o Lugar de Origen" (ubicada justo después de "Talle Remera").
* **CUIL Opcional para Distancia "INFANTILES"**: 
  - Se configuró el cliente para que si la distancia elegida es `INFANTILES`, el campo CUIL deje de ser obligatorio (`required`). El indicador visual cambia de forma dinámica a `(Opcional - 11 dígitos)`.
  - La validación en `validateStep` omite el CUIL si está vacío para niños, pero valida que tenga 11 dígitos en caso de que decidan completarlo.
  - El script de Google Sheets (`google-apps-script.js`) procesa y formatea el CUIL solo si el dato fue ingresado, evitando errores de formato.

### 9. Firma del Desarrollador con Contacto (Footer)
* **Pie de Página Acreditado con WhatsApp**: Se actualizó la leyenda de firma en la web pública (`index.html`) y en el Panel de Administración (`admin.html`) para incluir el teléfono de contacto. Ahora se muestra **`Diseño y Programación: RR Cómputos! (Tel: 2604552146)`** vinculando directamente a un chat de WhatsApp (`wa.me`) al hacerle clic.

### 10. Botón Flotante de Contacto WhatsApp (Configurable)
* **Botón Flotante de WhatsApp**: Se implementó un botón flotante con diseño de cápsula color verde oficial en la esquina inferior derecha del portal público (`index.html`) que contiene el texto en negrita **`SOPORTE`** junto al logotipo de WhatsApp, con animaciones de hover y sombras.
* **Redirección Directa**: Al hacer clic, abre un chat de WhatsApp con un mensaje predeterminado: *"Hola! Tengo una consulta sobre la carrera [Nombre de la carrera]"*.
* **Control en Panel**: Se agregó el campo **`Teléfono de Soporte WhatsApp`** en el panel administrativo (`admin.html`). El organizador puede cambiar el número en cualquier momento. Si el número se deja vacío, el botón flotante se oculta automáticamente.

### 11. Edición Interactiva de Categorías en Panel Administrativo
* **Botón de Edición (Lápiz) ✏️**: Se incorporó un botón de edición celeste al lado de cada categoría en la tabla de categorías activas del Panel de Administración (`admin.html`).
* **Modo Edición Reactivo**: Al hacer clic en el lápiz, los campos del formulario de creación se auto-completan con los datos de la categoría elegida (ID Interno, Nombre, Edad Mínima y Edad Máxima), el botón de acción cambia a **`Actualizar`** (guardar) y se revela un botón de **`Cancelar`** para revertir la acción de edición en caliente.
* **Actualización en Caliente**: Al presionar Actualizar, los cambios se aplican sobre la misma categoría en la lista de configuración, actualizando automáticamente la previsualización JSON y facilitando las correcciones rápidas.

### 12. Barra de Navegación Superior (Inscripciones y Clasificaciones)
* **Barra de Navegación Premium 🧭**: Se integró una barra de botones con diseño minimalista (`top-nav-bar`) al inicio del portal de inscripciones (`index.html`) para alternar y dirigir al usuario a las dos secciones principales de la carrera.
* **Toma de Acción**:
  - **Inscripciones**: Regresa al usuario suavemente al tope del portal principal.
  - **Clasificaciones**: Se vincula a un archivo PDF (por ejemplo, resultados generales). Si el organizador aún no ha cargado el PDF de resultados (estado inicial pre-carrera), al hacer clic se muestra un mensaje cortés e informativo: *"Las clasificaciones oficiales de la carrera estarán disponibles aquí una vez finalizado el evento. ¡Éxitos a todos los competidores!"*.
* **Carga Dinámica en Panel ⚙️**: Se añadió el campo **`Enlace del PDF de Clasificaciones`** en el Panel de Administración (`admin.html`), permitiendo que el organizador suba, asocie y actualice el PDF de forma dinámica al concluir la carrera para habilitar el botón automáticamente.

### 13. Descripción Multilínea de Circuitos por Distancia
* **Textarea de Detalles en Panel 📝**: Se reemplazó el campo de texto lineal de "Detalles de Distancia" por una caja de texto multilínea (`textarea`) en el Panel de Administración (`admin.html`), lo cual permite a los organizadores redactar descripciones extensas y completas (desniveles, cantidad de puestos, equipo obligatorio, etc.).
* **Previsualización en Tabla**: En la lista de distancias del administrador, los detalles largos se truncan automáticamente con puntos suspensivos para mantener la tabla limpia, pero revelan el contenido completo mediante un globo de ayuda (tooltip) al posicionar el cursor sobre ellos.
* **Presentación del Circuito en el Dashboard**: Se configuró la visualización del detalle en la página pública (`index.html`) con la regla `white-space: pre-line` en el elemento `#dashboard-dist-detail`, respetando fielmente todos los saltos de línea y listas de viñetas que el administrador configure para cada recorrido.

### 14. Resaltado Dinámico de Alias y CBU en Zona de Pago
* **Identificación Automática por Expresiones Regulares (Regex) 🔍**: Se programó un procesador en `app.js` que escanea las instrucciones de pago configuradas y envuelve dinámicamente las etiquetas `Alias: [Valor]` y `CBU: [Valor]` en etiquetas HTML destacadas.
* **Estilo Cyber-Glow 💎**: Se diseñó una clase CSS `.highlight-pay` que resalta el Alias y el CBU con un fondo semi-transparente celeste, tipografía monoespaciada para facilitar la lectura de caracteres, y un borde dashed y brillo neón sutil, asegurando que los corredores identifiquen y copien los datos bancarios al instante.

### 15. Baliza Parpadeante de Obligatoriedad de Comprobante
* **Diseño Tipo Baliza 🚨**: Se insertó una alerta premium con efecto "Beacon" parpadeante justo encima del cargador de comprobantes en el Paso 2 de la inscripción (`index.html`).
* **Efecto de Pulso Dinámico**: Se creó una animación CSS `@keyframes beacon-pulse` que expande de forma continua una onda translúcida naranja alrededor de un punto central brillante, atrayendo la atención del corredor de manera inequívoca.
* **Texto Persuasivo**: Muestra la leyenda en negrita y naranja: *"Es obligatorio subir el comprobante de pago para poder enviar la inscripción"*, reduciendo significativamente los abandonos de fichas incompletas.

### 16. Simplificación de Registro (Remoción de Casilla de Verificación)
* **Remoción de Casilla de Términos 🗹**: Se eliminó la casilla de verificación obligatoria de "Acepto los términos de deslinde de responsabilidad" en el Paso 2 para simplificar y acelerar el embudo de inscripción, eliminando clics innecesarios y posibles fricciones de validación.
* **Mensaje Motivacional Destacado 🚀**: En su lugar, se colocó un banner con borde discontinuo naranja y fondo destacado que muestra un icono de verificación de éxito y el mensaje motivador en mayúsculas: **"¡YA CASI TERMINAS! SUBE TU COMPROBANTE Y ESTARÁS INSCRIPTO"**.
* **Ajuste de Validación de Envío**: Se removió toda la lógica asociada a `acceptTerms` del cliente (`app.js`), permitiendo que el formulario habilite el botón de enviar y procese el registro de manera fluida en cuanto el usuario adjunte su comprobante de pago.

### 17. Optimización Visual del Banner de Sponsors (Auspiciantes)
* **Distribución más Compacta 🤝**: Se redujo el espacio (gap) del contenedor `.sponsors-grid` de `2rem` a `1rem`, y el padding de las tarjetas de `0.8rem 1.8rem` a `0.6rem 1.2rem`, logrando que las marcas patrocinadoras se muestren más juntas, unificadas y balanceadas en el portal.
* **Reducción de Palidez**: Se incrementó la opacidad inicial por defecto de los logos del `60%` al `82%` y se redujo la escala de grises inicial a solo un `15%`, logrando que los logotipos de los sponsors luzcan coloridos, vivos y nítidos desde el primer instante de carga de la web.
* **Efecto Hover Premium ✨**: Al posicionar el cursor sobre cualquier logo, la tarjeta escala sutilmente en tamaño (`1.06`) con una transición fluida tipo curva Bézier, recupera el 100% de su color original y proyecta una sombra luminosa con el color secundario celeste (`--accent-cyan`), resaltando de forma espectacular.

### 18. Autodetección Inteligente de Género por Nombre
* **Heurística Avanzada de Nombres en Español 👤**: Se incorporó un analizador inteligente de género en `app.js` (`guessGender`) calibrado para la demografía de nombres hispanohablantes y argentinos.
* **Mapeo por Suffixes y Diccionarios**:
  - Cuenta con un diccionario de excepciones de alta frecuencia (ej: "José", "Luca", "Bautista" como masculinos; "Sofía", "Lucía", "Belén", "Rocío", "Mercedes" como femeninos).
  - Utiliza reglas fonéticas y morfológicas (ej: terminación en `a` para femenino, terminación en `o`/`os`/`el`/`on`/`an` para masculino).
  - Limpia tildes y caracteres especiales automáticamente para evitar fallos de coincidencia.
* **Auto-completado en Tiempo Real**: En cuanto el corredor comienza a escribir su nombre (al alcanzar 3 caracteres en `#nombre`), el sistema deduce su género y pre-selecciona automáticamente el campo **`Género`** (Femenino o Masculino), acelerando la experiencia del formulario. El usuario siempre conserva la libertad de cambiarlo manualmente si lo desea.

### 19. Auto-completado Inteligente y Recordatorio de Datos (Autofill)
* **Activación de Autocompletado Nativo del Celular 📱**: Se modificó la etiqueta del formulario de `autocomplete="off"` a `autocomplete="on"` y se agregaron las propiedades semánticas correspondientes a cada campo de entrada en `index.html` (ej: `autocomplete="given-name"`, `autocomplete="family-name"`, `autocomplete="tel"`, `autocomplete="bday"`, `autocomplete="sex"`). De esta manera, el navegador del celular (Safari, Chrome) le ofrece al usuario rellenar instantáneamente la ficha completa utilizando sus datos de perfil guardados en sus contactos con un solo toque.
* **Memoria Local de Dispositivo (`localStorage` cache) 💾**:
  - Al procesar un envío de inscripción, los datos del formulario (Nombre, Apellido, CUIL, Fecha de Nacimiento, Género, Teléfono, Talle de Remera y Team) se guardan automáticamente en el almacenamiento local del dispositivo del corredor.
  - Al abrir el portal en el mismo dispositivo en el futuro (para otra inscripción o la del año siguiente), los datos se pre-cargan automáticamente, forzando los cálculos en vivo de edad y categoría, y resaltando de inmediato los campos en verde (`completed-field`). Esto reduce a segundos el tiempo necesario para registrarse.

### 20. Copia Interactiva al Portapapeles (Alias y CBU)
* **Botón de Copia e Icono 📋**: Se incorporó un icono de copiar (`fa-copy`) al lado del Alias y del CBU en el bloque de transferencia bancaria, indicando al usuario de forma clara que el elemento es interactivo.
* **Banner de Instrucción Destacado**: Se colocó una caja de ayuda celeste discontinua justo debajo de las cuentas que dice en negrita: **"👉 COPIA EL ALIAS: ¡Toca sobre el Alias o CBU resaltado para copiarlo automáticamente!"**.
* **Efecto de Copiado y Morphing**:
  - Al hacer clic, el valor (Alias o CBU) se copia automáticamente al portapapeles usando la API nativa de JavaScript.
  - Como confirmación, la etiqueta morph-cambia su contenido de forma inmediata mostrando un mensaje verde de éxito: **`¡Copiado! ✓`** durante 1.5 segundos antes de volver suavemente a su estado inicial. Esto evita errores de digitación y agiliza la transferencia bancaria.

### 21. Formateo y Mapeo de Datos en Planilla (Fecha y Género)
* **Fecha Nacimiento en Formato Día/Mes/Año 📅**: Se implementó una lógica de formateo bidireccional en el frontend (`app.js`) y en el backend (`google-apps-script.js`) que toma la fecha en formato ISO estándar de los navegadores (`YYYY-MM-DD`) y la convierte a formato latino y amigable: **`DD/MM/YYYY`** (Día/Mes/Año), escribiéndola limpia y ordenada en la celda del Google Sheet.
* **Género Mapeado a Damas / Caballeros 👫**: Se incorporó un convertidor de etiquetas que reemplaza los valores de base de datos `"Femenino"` y `"Masculino"` por las nomenclaturas deportivas oficiales preferidas por los corredores: **`Damas`** y **`Caballeros`**, almacenando estos textos formateados directamente en la columna de Género de la planilla.
* **Compatibilidad de Precarga Preservada**: El formateo de envío ocurre únicamente durante la construcción del paquete de red, lo que garantiza que los datos locales almacenados sigan en formato HTML estándar (`YYYY-MM-DD` y `"Femenino"`/`"Masculino"`), manteniendo intacta la capacidad de autocompletado y cálculo en el dispositivo.

### 22. Entrada de Fecha Separada (Día, Mes y Año con Barras Físicas)
* **Tres Inputs de Texto Independientes 📅**: Se reemplazó el campo único de fecha por tres campos numéricos side-by-side (`#birth_day`, `#birth_month`, `#birth_year`), eliminando completamente la ventana emergente de calendario y cualquier máscara de texto artificial propensa a fallos de cursor.
* **Separadores Fijos Inamovibles**: Las barras `/` ahora son elementos HTML estáticos de texto (`<span>/</span>`) ubicados físicamente entre los inputs. Esto asegura que el usuario vea la estructura de la fecha en todo momento sin que se altere o desaparezca al escribir o borrar.
* **Salto de Foco Inteligente y Auto-jump ⚡**:
  - Al completar los 2 dígitos del Día, el cursor salta automáticamente al campo del Mes.
  - Al completar los 2 dígitos del Mes, el cursor salta automáticamente al campo del Año.
  - Al presionar borrar (Backspace) en un campo vacío, el foco retrocede automáticamente al campo anterior, ofreciendo una experiencia táctil y fluida.
* **Sincronización en Segundo Plano**: Una lógica interna en `app.js` unifica los valores en un campo oculto `#fecha_nacimiento` y desencadena las validaciones y los cálculos de edad y categoría al vuelo, preservando el 100% de la compatibilidad con el resto del sistema de envío y caché.
