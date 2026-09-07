# 📖 Manual Paso a Paso: Cómo Crear y Configurar una Nueva Carrera

Este manual te guiará para configurar y lanzar un portal de inscripciones para una carrera nueva utilizando tu plataforma.

El proceso consta de 4 fases sencillas:

---

## 📂 FASE 1: Preparar la nueva Base de Datos (Google Sheets)

Para evitar que los inscritos de la carrera nueva se mezclen con los de la carrera anterior, necesitas una copia limpia de la planilla:

1. **Hacer una copia**: Abre tu Google Drive, busca la planilla de inscripciones actual ("Tercer Tiempo"), haz clic derecho y selecciona **"Hacer una copia"**.
2. **Cambiar el nombre**: Ponle un nombre descriptivo a la nueva planilla (Ej: *Inscripciones - Carrera Valle Grande 2026*).
3. **Limpiar datos viejos**: Abre la planilla nueva y borra los datos de los corredores inscritos en la pestaña **Inscripciones** (borra a partir de la fila 2 hacia abajo, **dejando intacta la fila 1** con los títulos de las columnas).
4. **Obtener el enlace de conexión (Apps Script)**:
   * En la planilla, ve al menú superior **Extensiones ➔ Apps Script**.
   * Arriba a la derecha, haz clic en el botón azul **"Implementar" ➔ "Gestionar implementaciones"**.
   * Haz clic en el ícono del **Lápiz (Editar)** de la implementación activa.
   * En la casilla de "Versión", selecciona **"Nueva versión"** (New version).
   * Haz clic en el botón azul **"Implementar"** (Deploy).
   * Copia la dirección web completa que te da abajo, bajo el título **"URL de la aplicación web"** (Web App URL). *Este enlace es el que conecta la web con tu planilla.*

---

## 💻 FASE 2: Configurar los datos en el Panel de Administración

1. Abre el panel de administración en tu computadora (`http://localhost:3000/admin.html`).
2. **Paso 1: Conexión**: Pega la URL que copiaste en el paso anterior en el casillero **"URL de la Aplicación Web de Google Apps Script"** (justo debajo del nombre de la carrera).
3. **Completar datos de la carrera**:
   * Modifica el nombre de la carrera, el reglamento y el teléfono de soporte de WhatsApp.
   * Revisa/crea los campos adicionales que desees solicitar en el formulario.
   * Sube los nuevos archivos multimedia (Logo, Remera Oficial, Afiche de Fondo).
   * Configura las nuevas distancias (5K, 10K, 21K, etc.) con sus precios, enlaces de mapas (Garmin/Strava) y sube los archivos de circuitos (.GPX / .KML) y perfiles de elevación de cada una.
   * Sube la imagen del **Kit de Competidor** (A4) si lo tienes disponible.
   * Define las categorías por edad para cada distancia.
   * Pega los datos de la cuenta bancaria para las transferencias de pago.
4. **Paso 8: Guardar**: Haz clic en el botón verde **"GUARDAR EN DISCO"**. Esto actualizará y guardará los archivos `config.js` y `config.json` en tu computadora de inmediato.

---

## 🌐 FASE 3: Definir dónde publicar la nueva carrera en GitHub

Elige una de las siguientes dos alternativas según tu necesidad:

### Opción A: Reemplazar la carrera actual (Más fácil)
*Si la carrera anterior ya terminó y quieres que la misma dirección de internet (`https://rrmalargue.github.io/carrera-tercer-tiempo/`) ahora muestre la carrera nueva:*
* Solo debes subir tus nuevos archivos al mismo repositorio de GitHub que ya vienes usando.

### Opción B: Tener ambas carreras activas al mismo tiempo (Recomendado)
*Si quieres conservar la web de la carrera anterior activa y crear una dirección de internet nueva para esta (Ej: `https://rrmalargue.github.io/carrera-nueva/`):*
1. Entra a tu cuenta en `github.com`.
2. Crea un **nuevo repositorio público** con el nombre de tu nueva carrera (Ej: `carrera-nueva`).
3. Activa **GitHub Pages** en ese nuevo repositorio:
   * Ve a **Settings** (Ajustes) dentro del repositorio.
   * En la barra lateral izquierda, haz clic en **Pages**.
   * En la sección *Build and deployment ➔ Branch*, selecciona **`main`** (o `master`) y la carpeta **`/ (root)`**, luego haz clic en **Save** (Guardar).
4. Sube **todos los archivos** del proyecto que tienes en tu PC (`trail-registration-portal`) a este nuevo repositorio.

---

## 🚀 FASE 4: Publicar los archivos en GitHub

Al final del Panel de Administración, en el **Paso 9**, verás la lista automática de los archivos que fueron modificados o subidos en tu computadora durante la sesión.

1. Abre tu repositorio elegido en GitHub desde el navegador.
2. Arrastra y sube los archivos indicados en la lista del panel. Habitualmente serán:
   * 📄 `config.js`
   * 📄 `config.json`
   * 🖼️ Las imágenes/GPX que hayas subido (guardadas dentro de tu carpeta local **`IMAGENES`**).
   * *(Si es un repositorio nuevo en GitHub, deberás subir todos los archivos del proyecto la primera vez: index.html, app.js, sw.js, manifest.json, carpeta assets, etc.)*
3. Haz clic en **"Commit changes"** (Confirmar cambios) en GitHub.
4. Espera 1 minuto y ¡tu nuevo portal de inscripciones estará online en internet!
