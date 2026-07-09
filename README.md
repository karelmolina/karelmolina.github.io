# Karel Molina — Personal Profile

Static single-page site for GitHub Pages, with professional profile and an interactive Live2D Cubism 4 avatar.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Or with Node.js:

```bash
npx serve .
```

## Deploy to GitHub Pages

1. Push the contents of this folder to a repository named `karelmolina.github.io`.
2. Go to **Settings > Pages** in the repository.
3. Under **Source** select **Deploy from a branch**, choose `main` and folder `/ (root)`.
4. Save and wait a few minutes for the site to be available.

## Structure

- `index.html` — profile content and avatar container.
- `css/styles.css` — responsive styles.
- `js/live2d.js` — PixiJS + pixi-live2d-display integration for Cubism 4.
- `js/live2dcubismcore.min.js` — Live2D Cubism 4 core.
- `assets/live2d/wanko/` — Live2D model, motions and textures.

## Live2D model license

The `wanko_ja` model (わんころもち PRO版) is sample data provided by Live2D Inc. and is subject to their terms of use:
https://www.live2d.com/download/sample-data/

## Credits

- Profile based on https://github.com/karelmolina/karelmolina
- Live2D integration via [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
