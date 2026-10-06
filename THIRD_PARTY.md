# Original design and bundled assets

This is a frontend recreation of [WØRKS](https://works.studio/), maintained by ScriptingWithSaad. The yellow/black/white layout, studio statement, project names, original logo, and intro footage are retained from the existing project. This repository does not grant additional rights to studio artwork, brand marks, or fonts.

The 17 old image URLs returned HTTP 404. Their replacement images come from the corresponding case studies in the current WØRKS project catalogue. `assets/optimized/manifest.json` records each public image source, case-study URL, original file size, and local WebP variants. One existing card used Kith artwork under a Converse caption; its caption now matches its source.

- GSAP 3.12.5 is served locally with its original copyright/license notice. [GSAP licensing](https://gsap.com/standard-license/).
- Locomotive Scroll 5.0.1 replaces 3.5.4 and uses its bundled Lenis 1.3.17 engine. Both MIT notices are retained in `assets/vendor`.
- The existing Freight Big Pro and Neue Haas Display fonts are retained. Local WOFF2 files are compressed versions of those same files, not replacement typefaces. Their original licensing still applies.
- `assets/optimized/intro-poster.webp` is a frame from the original intro video.
- `assets/optimized/intro-faststart.mp4` contains the original video/audio streams without re-encoding. Its metadata is moved before the media data so playback can start before the complete download.

[Locomotive Scroll 5.0.1 documentation](https://github.com/locomotivemtl/locomotive-scroll/tree/v5.0.1) describes its native scrollbar, mobile touch handling, and parallax behaviour.
