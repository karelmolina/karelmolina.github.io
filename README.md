# Karel Molina — Perfil personal

Sitio estático de una sola página para GitHub Pages, con perfil profesional y un avatar Live2D interactivo.

## Vista previa local

```bash
python3 -m http.server 8000
```

Luego abre http://localhost:8000 en el navegador.

También puedes usar Node.js:

```bash
npx serve .
```

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio llamado `karelmolina.github.io`.
2. Ve a **Settings > Pages** del repositorio.
3. En **Source** selecciona **Deploy from a branch** y elige la rama `main` con la carpeta `/ (root)`.
4. Guarda y espera unos minutos a que el sitio esté disponible.

## Estructura

- `index.html` — contenido del perfil y contenedor del avatar.
- `css/styles.css` — estilos responsive.
- `js/live2d.js` — integración con PixiJS y `pixi-live2d-display` para Cubism 4.
- `js/live2dcubismcore.min.js` — core de Live2D Cubism 4.
- `assets/live2d/wanko/` — modelo Live2D y sus motions/texturas.

## Licencia del modelo Live2D

El modelo `wanko_ja` (わんころもち PRO版) es sample data proporcionado por Live2D Inc. y está sujeto a sus términos de uso:
https://www.live2d.com/download/sample-data/

## Créditos

- Perfil basado en la información de https://github.com/karelmolina/karelmolina
- Integración Live2D con [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
