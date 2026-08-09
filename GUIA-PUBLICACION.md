# Guía para publicar los Manipulativos Luca en internet (Vercel)

**Para quién es esta guía:** cualquier persona, sin conocimientos de programación.
**Tiempo estimado:** 15 a 20 minutos la primera vez.
**Qué necesitas:** una computadora con internet, un correo electrónico y el archivo `luca-vercel.zip` que ya tienes.

Al terminar tendrás una dirección de internet (por ejemplo `https://manipulativos-luca.vercel.app`) que podrás compartir con maestros y alumnos. Es gratis.

---

## Antes de empezar: prepara la carpeta

1. Busca el archivo **`luca-vercel.zip`** en tu computadora (normalmente está en la carpeta **Descargas**).
2. Haz **clic derecho** sobre él y elige **"Extraer todo…"** (en Windows) o simplemente haz **doble clic** (en Mac).
3. Se creará una carpeta llamada **`luca-vercel`**. Ábrela y confirma que adentro veas estos archivos:
   - `index.html`
   - `abaco.html`
   - `cubo-base10.html`
   - `tangram.html`
   - `fracciones.html`
   - `vercel.json`
   - una carpeta llamada `assets`
4. Deja esa ventana abierta; la usarás en la Parte 2.

> 💡 Si quieres ver las herramientas antes de publicarlas, haz doble clic en `index.html` y se abrirán en tu navegador. Todo funciona igual que como quedará en internet.

---

## Parte 1 — Crea tu cuenta en GitHub (la "bodega" de los archivos)

GitHub es un sitio gratuito donde se guardan los archivos. Vercel los tomará de ahí para publicarlos.

1. Entra a **github.com** en tu navegador.
2. Haz clic en el botón **"Sign up"** (arriba a la derecha).
3. Escribe tu **correo electrónico** y presiona **Continue**.
4. Inventa una **contraseña** y presiona **Continue**.
5. Inventa un **nombre de usuario** (por ejemplo `luca-educacion`) y presiona **Continue**.
6. GitHub te enviará un **código a tu correo**. Ábrelo, copia el código y pégalo en la página.
7. Si te hace preguntas sobre tu equipo o intereses, puedes elegir cualquier opción o buscar el enlace **"Skip"** para saltarlas.
8. Listo: ya tienes cuenta. Deberías ver la pantalla principal de GitHub.

---

## Parte 2 — Sube la carpeta a GitHub

1. Estando dentro de github.com, haz clic en el botón verde **"New"** (o en el símbolo **+** de la esquina superior derecha y luego **"New repository"**).
2. En el campo **"Repository name"** escribe: `manipulativos-luca` (todo en minúsculas, con guion).
3. Deja seleccionada la opción **"Public"**.
4. No marques ninguna otra casilla. Baja y presiona el botón verde **"Create repository"**.
5. Verás una página con varias instrucciones. Busca el enlace azul que dice **"uploading an existing file"** y haz clic en él.
6. Ahora viene el paso clave. Acomoda dos ventanas en tu pantalla: la del navegador y la de la carpeta **`luca-vercel`** que abriste al inicio.
7. Dentro de la carpeta, **selecciona TODO lo que hay adentro** (los 5 archivos `.html`, el `vercel.json`, el `README-DEPLOY.md` y la carpeta `assets`). Truco: haz clic en el primer elemento y luego presiona **Ctrl + E** en Windows o **Cmd + A** en Mac para seleccionar todo.

   > ⚠️ **Muy importante:** arrastra el **contenido** de la carpeta, **no** la carpeta `luca-vercel` completa. Si arrastras la carpeta entera, la página no funcionará después.

8. **Arrastra** esa selección hacia la zona del navegador que dice **"Drag files here to add them to your repository"** y suéltala ahí.
9. Espera a que aparezca la lista completa de archivos (debe incluir `assets/comun.js` y `assets/styles.css`).
10. Baja hasta el final de la página y presiona el botón verde **"Commit changes"**.
11. Espera unos segundos. Cuando la página se recargue y veas la lista de tus archivos, la subida quedó completa.

---

## Parte 3 — Publica con Vercel

1. Abre una pestaña nueva y entra a **vercel.com**.
2. Haz clic en **"Sign Up"**.
3. Elige el plan gratuito si te pregunta (**"Hobby"**) y escribe tu nombre.
4. Cuando te pregunte cómo quieres entrar, elige **"Continue with GitHub"**. Se abrirá una ventana de GitHub: presiona el botón verde **"Authorize Vercel"**. (Así Vercel puede leer tus archivos.)
5. Ya dentro de Vercel, haz clic en el botón **"Add New…"** y luego en **"Project"**.
6. Verás una lista con tus repositorios de GitHub. Busca **`manipulativos-luca`** y presiona el botón **"Import"** que está a su lado.
   - Si no aparece en la lista, haz clic en **"Adjust GitHub App Permissions"** o **"Install"**, elige tu cuenta, selecciona **"All repositories"** y presiona **"Install"**. Al volver, ya aparecerá.
7. En la pantalla de configuración **no cambies nada**. Solo presiona el botón **"Deploy"**.
8. Espera entre 30 segundos y 1 minuto. Verás confeti 🎉 y un mensaje de felicitación.
9. Haz clic en la **imagen de vista previa** o en el botón **"Continue to Dashboard"** y luego en **"Visit"**.

**¡Eso es todo!** La dirección que aparece en tu navegador (algo como `https://manipulativos-luca.vercel.app`) es tu sitio publicado. Cópiala y compártela con quien quieras.

---

## Parte 4 — Comprueba que todo funciona (2 minutos)

Abre tu nueva dirección y verifica esta lista:

- [ ] Se ve la pantalla **"Manipulativos"** con las tarjetas de las 4 herramientas.
- [ ] Al tocar **Ábaco**, la dirección cambia a `/abaco` y se ve el ábaco con el botón morado **L.** abajo a la derecha.
- [ ] Al tocar el botón **L.** se abre el menú circular.
- [ ] Dentro del menú, el botón **⋯** abre la lista de acciones de la herramienta.
- [ ] El botón de la **T** te deja escribir un texto sobre el lienzo.
- [ ] La flecha **←** te regresa a la pantalla de inicio.
- [ ] Repite la prueba en una **tablet o celular** con la misma dirección.

Si todos los puntos se cumplen, la publicación quedó perfecta.

---

## ¿Cómo actualizo el sitio en el futuro?

Cuando recibas archivos nuevos (por ejemplo un `abaco.html` corregido):

1. Entra a **github.com**, abre tu repositorio **`manipulativos-luca`**.
2. Haz clic en **"Add file"** → **"Upload files"**.
3. Arrastra los archivos nuevos (reemplazarán a los anteriores porque se llaman igual).
4. Presiona **"Commit changes"**.
5. **No tienes que hacer nada en Vercel:** detecta el cambio solo y en un minuto tu sitio ya está actualizado. Si no ves el cambio, recarga con **Ctrl + Shift + R** (Windows) o **Cmd + Shift + R** (Mac).

---

## Si algo sale mal

| Lo que ves | Qué significa | Cómo se arregla |
|---|---|---|
| La página dice **"404: NOT_FOUND"** | Los archivos quedaron dentro de una subcarpeta al subirlos | En GitHub, entra al repositorio: si al abrirlo ves una carpeta `luca-vercel` en vez de los archivos sueltos, bórrala (ábrela → botón "…" → Delete directory) y repite la **Parte 2** arrastrando solo el contenido |
| El sitio se ve **sin colores ni diseño** | Faltó subir la carpeta `assets` | En GitHub usa **"Add file → Upload files"** y arrastra la carpeta `assets` completa |
| Hice un cambio y **no se ve** | El navegador guardó la versión vieja | Recarga con **Ctrl + Shift + R** (o **Cmd + Shift + R** en Mac) |
| Vercel pide **tarjeta de crédito** | Elegiste el plan equivocado | Regresa y selecciona el plan **"Hobby"**, que es gratuito y no pide tarjeta |
| No encuentro mi repositorio en Vercel | Vercel no tiene permiso de verlo | En la pantalla de importar, usa **"Adjust GitHub App Permissions"** y concede acceso a todos los repositorios |

---

*Guía elaborada para el proyecto Manipulativos Luca · versión Vercel estática.*
