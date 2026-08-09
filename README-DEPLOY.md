# Manipulativos Luca — Despliegue en Vercel

Sitio 100% estático. `Code.gs` y los scriptlets de Apps Script ya no existen: los
compartidos son archivos reales (`assets/styles.css`, `assets/comun.js`) y la
navegación usa rutas limpias (`/`, `/abaco`, `/cubo-base10`, `/tangram`, `/fracciones`).

## Publicar
1. `npm i -g vercel` (o usa el dashboard).
2. Desde esta carpeta: `vercel --prod` — sin build step, framework "Other".
   Alternativa: sube la carpeta a un repo de GitHub e importa el proyecto en vercel.com.

## QA local
Doble clic en cualquier `.html` funciona (la navegación detecta `file://` y usa
sufijos `.html`), o `npx serve .` para probar con rutas limpias.

## Notas
- CDNs externos: Google Fonts, cdnjs (html2canvas) y unpkg (lucide).
- `vercel.json` activa cleanUrls y cachea `/assets` como inmutable.
