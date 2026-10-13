# Teen Fiesta — RED ROOM implementation

Completed in the existing project on 13 October 2026. Local development URL: [localhost:3001](http://localhost:3001/).

## Page and creative direction

The homepage now includes the hero, Experience, confirmed lineup, campaign gallery, archive film, event details, DASH pass preview and footer. `/pricing` is a matching pass-information page. The original poster and supplied campaign photographs remain the content sources. Near-black backgrounds, white display typography, italic editorial headings, crimson accents, precise rules, framed media and selective group entrances form the shared visual system.

The public [Basement Studio site](https://basement.studio/) informed the typography, spacing, image hierarchy and restraint of the transitions. No Basement branding, text or portfolio assets were used.

The [Uiverse component integration](UIVERSE_COMPONENTS.md) adds a scoped paired underline to editorial text actions, a keyboard-operable reduced-motion switch, and a film buffer indicator styled from an editorial progress readout. Source URLs, creator notices, licenses, and adaptations are documented in the component inventory.

## Real 3D chrome knot

- Replaced the previous sculpture with two custom closed swept bands. Four alternating crossings produce a readable weave with measured clearance.
- Each main band has 12,288 vertices and 24,576 triangles; the two bands total 49,152 main triangles. Wrapped indexed topology and smooth normals avoid longitudinal seams.
- Silver physical materials, a locally generated PMREM studio environment, restrained ruby shading and two short inset crimson accents create the reflections. No downloaded HDR or model is required.
- Separate nested groups own entrance, passive movement, damped pointer response and scroll transforms, avoiding competing transform writers.
- Pointer response is limited to devices reporting a fine pointer and hover. Mobile pixel ratio is capped at 1; desktop at 1.25. Rendering pauses offscreen and when the document is hidden. Reduced motion uses a static pose.
- The dynamic client scene has an SVG loading/WebGL fallback. The primary sculpture remains actual mesh geometry.

## Lenis and motion

One root Lenis instance uses `autoRaf: false`, `lerp: 0.115` and the existing GSAP ticker. GSAP time is converted from seconds to milliseconds; Lenis scroll events update ScrollTrigger. There is no independent Lenis animation loop. This follows the [official Lenis GSAP integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger).

Wheel scrolling is smooth and responsive. `syncTouch: false` retains native touch scrolling. A single delegated same-document anchor handler preserves URL hashes, browser history, target focus and header clearance. Initial hashes, hash changes and browser Back/Forward resolve real section targets. Route changes resize Lenis and refresh ScrollTrigger. Cleanup removes listeners, ticker callbacks and pending one-shot animation frames, then destroys the instance.

Mobile navigation and the gallery lightbox use native dialogs with shared, reference-counted background scroll locking. Nested gallery scrolling is excluded using `data-lenis-prevent`. Dialogs support Escape and focus restoration.

System reduced-motion preferences disable optional motion; the footer also lets visitors reduce motion and saves that choice. A manual choice cannot override an operating-system request for reduced motion. GSAP reveals, Lenis, pointer tilt, passive movement and the atmospheric shader use this shared setting.

## Shader atmosphere

The [ShaderGradient website](https://shadergradient.co/) and its [official React implementation](https://github.com/ruucm/shadergradient) were inspected against the installed React 19 / React Three Fiber 9 / Three.js stack.

Following the requirement to reuse the existing setup where it can achieve the effect, the site uses a native three-colour GLSL atmosphere in the sculpture's existing Canvas. **`@shadergradient/react` was not installed or imported.** The effect is inspired by ShaderGradient rather than a package integration. It moves slowly between near-black and deep crimson behind the knot; ordinary CSS supplies the other section accents and fallback. There is one homepage WebGL canvas, no canvas on `/pricing`, and no second background renderer.

Only Lenis was added as a runtime dependency. Working React, Next.js, Three.js and React Three Fiber versions were retained.

## Functional content

- Gallery: eight supplied campaign images; previous/next controls, thumbnails, enlarged view, keyboard arrows and Escape.
- Film: supplied campaign video, clearly labelled as the August 2026 archive chapter; native playback controls, no autoplay sound, offscreen pause, MP4 → WebM → original-source fallback, and a visible retry action on final failure. The web derivatives remove the source video's baked-in outer black padding.
- Event: source-confirmed 31 October 2026, 5–9 PM, Mansion Agra, music by Fentatine.
- DASH: ticket design is clearly labelled as a preview, not an issued pass. Prices, inclusions and booking links remain unannounced because none were supplied. No invented artists, activities, venue address, map pin or social links were added.

## Changed files

| Area | Files |
| --- | --- |
| Pages and shared styling | `app/page.tsx`, `app/pricing/page.tsx`, `app/layout.tsx`, `app/globals.css` |
| Navigation and scrolling | `Navigation.tsx`, `SmoothScroll.tsx`, `MotionSettings.tsx`, `MotionObserver.tsx` |
| Sculpture | `SculptureStage.tsx`, `SculptureFallback.tsx`, new `ChromeKnotScene.tsx`, `chrome-knot-geometry.ts`, `chrome-knot-studio.ts`, `CrimsonAtmosphere.tsx`; removed `ChromeStarburstScene.tsx` |
| Page interactions | new `CampaignGallery.tsx`, `FilmPlayer.tsx`, `DashTicket.tsx`, `SiteFooter.tsx` |
| Data and assets | new `app/data/campaign.ts`, `public/media/campaign-film-wide.mp4`, `campaign-film-wide.webm`, `film-poster.jpg` |
| Dependencies and checks | `package.json`, `package-lock.json`, new `tests/chrome-knot.test.mjs` |

Component filenames above are under `app/components`. Existing user reference files were preserved. Next.js also updated its generated `next-env.d.ts` during development.

## Verification actually performed

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed on final source |
| `npm run test` | 2/2 passed: manifold topology, finite unit normals, closed paths, crossing clearance and geometry budget |
| `npm run build` | Passed on final source; static `/` and `/pricing` generated |
| `git diff --check` | Passed; only Windows line-ending notices |
| Lint | No lint script/configuration exists. `npm run lint --if-present` skipped; no lint pass is claimed |
| Viewports | Inspected actual rendered site at 1440×900, 1280×800, 768×1024, 390×844 and 360×800; no horizontal overflow observed |
| Scrolling/navigation | Wheel-style browser scrolling, keyboard scrolling, section anchors, direct section hashes, cross-route links and browser Back inspected |
| Mobile menu | Open, focus, Tab, Escape, close-on-navigation and background scroll lock verified |
| Gallery | Next/previous, thumbnail selection, enlarged artwork, arrow keys, Escape, background lock and restored focus verified |
| Film | Played to completion (16.415 seconds, readyState 4); active playback paused when navigating away |
| Motion | Footer reduced-motion mode, restored visible content, immediate anchors, persistence to pass route, cursor tilt and forward/reverse sculpture scrolling inspected |
| Canvas and console | One homepage canvas, zero on pass route; no captured browser console errors in final interaction pass |
| Uiverse integrations | Film playback and buffer state, gallery next control, mobile menu, and motion switch tested; switch works with mouse and keyboard. Three selected source snippets and their MIT notices are recorded in `UIVERSE_COMPONENTS.md` |

Visible defects corrected during inspection included duplicated header anchor offset, gallery focus restoration after changing images, the film source-selection failure, a pass-page poster aspect warning and GSAP selectors targeting absent hero elements on `/pricing`.

## Limits and remaining items

- Physical trackpad and touchscreen gestures were not available in this browser session. Their native/Lenis configuration was reviewed; actual hardware testing is still required.
- The operating-system preference listener and WebGL-unavailable fallback are implemented, but actual OS preference switching and deliberate GPU failure were not emulated. The site's reduced-motion control was tested.
- An upstream React Three Fiber / Three.js `THREE.Clock` deprecation warning remains. Initial renderer compilation also produced nonfatal driver precision notices. No dependency upgrade was attempted solely to remove these warnings.
- Exact venue address, ticket pricing, inclusions, booking URL and further lineup/activity announcements still require real event information.
- The result is running locally; no public deployment was performed.

## Rendered proof

![Desktop hero](C:/Users/Lenovo/.codex/visualizations/2026/10/13/01a133ee-9fa3-7353-b043-31ab57ff8dc1/red-room-1440-900.jpg)

[Aftermovie on mobile](C:/Users/Lenovo/.codex/visualizations/2026/10/13/01a133ee-9fa3-7353-b043-31ab57ff8dc1/red-room-uiverse-aftermovie-mobile.jpg) · [Mobile hero](C:/Users/Lenovo/.codex/visualizations/2026/10/13/01a133ee-9fa3-7353-b043-31ab57ff8dc1/red-room-390-844.jpg) · [Tablet hero](C:/Users/Lenovo/.codex/visualizations/2026/10/13/01a133ee-9fa3-7353-b043-31ab57ff8dc1/red-room-768-1024.jpg) · [Mobile pass page](C:/Users/Lenovo/.codex/visualizations/2026/10/13/01a133ee-9fa3-7353-b043-31ab57ff8dc1/red-room-pricing-mobile.jpg)
