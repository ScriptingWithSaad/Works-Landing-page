# Works Landing Page

A responsive HTML, CSS and JavaScript recreation of WØRKS.

[Open the website](https://scriptingwithsaad.github.io/Works-Landing-page/)

The original yellow intro, video/curtain GSAP sequence, serif typography, featured-project image changes, moving service strips, and project hover overlays remain. The full-page transform scroll container has been replaced by Locomotive Scroll 5's native scrolling engine; phones use native touch scrolling. Parallax stays inside the hero so it cannot create blank gaps between sections.

The layout adapts to phones, tablets, desktop screens and short landscape screens. Featured projects work with hover, touch and keyboard. Navigation points to actual sections; project cards open their original case studies. The mobile menu supports Escape, focus containment and a stable scrollbar gutter. Reduced-motion preferences and unavailable animation libraries leave content and native navigation usable.

All 17 broken external image links now have local WebP images. Cards use responsive image sizes, lazy loading, explicit dimensions and asynchronous decoding. Featured backgrounds warm up near their section. Inactive/offscreen service marquees pause, and the intro video unloads after the transition or on user interaction. Fonts and scripts are local to avoid CDN dependency failures.

The original image sources total 13.82 MB; the 960px WebP set totals 1.18 MB. Browsers select 480px, 960px or up-to-1600px variants for their display density. This is an asset-size comparison, not a measured page-load-speed guarantee.

## Local preview

Run `python -m http.server 8785`, then open `http://127.0.0.1:8785/`.

## Checks

Run `python scripts/build_assets.py` after changing the source CSS or JavaScript; then run `python scripts/verify_assets.py` and `node --check javascript/script.js`. Browser verification covers phone/tablet/desktop widths, short landscape, section navigation, menu open/close, featured image selection, gallery image loading, wheel scrolling over artwork, and back-to-top navigation.

See [asset attribution](THIRD_PARTY.md) and the image manifest for sources and library notices.
