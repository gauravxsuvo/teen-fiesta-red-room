# Uiverse component integration

Reviewed the live [Uiverse library](https://uiverse.io/) and each selected component's HTML and CSS source. The components below are adapted to the site's existing CSS and React code; no Uiverse dependency or other package was added.

| Uiverse source | Original purpose | RED ROOM placement | Adaptation |
| --- | --- | --- | --- |
| [biswacpcode — button](https://uiverse.io/biswacpcode/curvy-crab-71) | Two animated underline rules on a hoverable text button | Hero, section and footer `.text-link` actions | Scoped to `.text-link`; fine crimson rules animate from each edge; retains existing arrow movement, keyboard focus, and touch usability. |
| [Admin12121 — switch](https://uiverse.io/Admin12121/massive-dodo-67) | Animated track and sliding switch knob | Footer reduced-motion control | Rebuilt as a native button with `aria-pressed`, the existing preference behavior and persistence. Recolored to charcoal, silver and crimson. The operating-system reduced-motion setting remains authoritative. |
| [uiverse-astronaut — Provisioning progress readout](https://uiverse.io/uiverse-astronaut/pretty-husky-54) | Editorial status label, percentage and thin animated progress track | Aftermovie buffering state | Keeps the mono status and hairline track. Uses actual `HTMLMediaElement.buffered` data when available; the moving crimson sweep indicates activity when no percentage is available. No invented step labels or fixed percentage. |

All three are MIT licensed on their Uiverse pages. Their original code was reviewed directly in the Uiverse HTML/CSS tabs. The snippets were adapted and restyled, rather than copied as global styles. Original selectors, palette and layout were not introduced wholesale. The site continues to use its current dependencies.

## Attribution and license notices

The source pages display the following copyright notices. Adapted portions retain the original MIT notices and are provided without warranty.

```text
Copyright - 2026 biswacpcode (Biswajit Rout)
Copyright - 2026 Admin12121 (Admin12121)
Copyright - 2026 uiverse-astronaut (Astronaut)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
