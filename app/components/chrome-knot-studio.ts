import * as THREE from "three";
/** Linear HDR studio panorama, baked once into PMREM. Graduated softboxes
 * describe curvature instead of reflecting featureless white rectangles. */
export function createChromeStudio() {
    const width = 1024;
    const height = 512;
    const data = new Float32Array(width * height * 4);
    const panels = [
        { u: 0.06, v: 0.46, w: 0.016, h: 0.34, power: 3, color: [1, 1, 1] },
        { u: 0.24, v: 0.3, w: 0.025, h: 0.22, power: 1.8, color: [0.98, 0.99, 1] },
        { u: 0.48, v: 0.4, w: 0.014, h: 0.32, power: 3.5, color: [1, 1, 1] },
        { u: 0.64, v: 0.28, w: 0.02, h: 0.22, power: 2.2, color: [1, 1, 1] },
        { u: 0.885, v: 0.44, w: 0.035, h: 0.29, power: 3.5, color: [1, 1, 1] },
        { u: 0.73, v: 0.55, w: 0.022, h: 0.3, power: 1.7, color: [1, 0.006, 0.022] },
        { u: 0.15, v: 0.72, w: 0.018, h: 0.2, power: 1.2, color: [1, 0.004, 0.015] },
    ];
    for (let y = 0; y < height; y += 1) {
        const v = y / (height - 1);
        for (let x = 0; x < width; x += 1) {
            const u = x / width;
            const base = 0.015 + 0.045 * Math.pow(0.5 + 0.5 * Math.cos((u - 0.35) * Math.PI * 2), 2)
                + 0.025 * Math.pow(Math.cos(v * Math.PI), 4);
            let r = base;
            let g = base;
            let b = base * 1.03;
            for (const panel of panels) {
                const delta = Math.abs(u - panel.u);
                const du = Math.min(delta, 1 - delta) / panel.w;
                const dv = (v - panel.v) / panel.h;
                const energy = panel.power * Math.exp(-2 * du * du - Math.pow(dv, 6));
                r += energy * panel.color[0];
                g += energy * panel.color[1];
                b += energy * panel.color[2];
            }
            // A low softbox catches the rounded underside of the flowing bands.
            const lower = 0.85 * Math.exp(-Math.pow((v - 0.79) / 0.018, 2))
                * Math.exp(-Math.pow((u - 0.5) / 0.23, 4));
            const index = (y * width + x) * 4;
            data[index] = r + lower;
            data[index + 1] = g + lower;
            data[index + 2] = b + lower;
            data[index + 3] = 1;
        }
    }
    const panorama = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
    panorama.mapping = THREE.EquirectangularReflectionMapping;
    panorama.colorSpace = THREE.LinearSRGBColorSpace;
    panorama.minFilter = THREE.LinearFilter;
    panorama.magFilter = THREE.LinearFilter;
    panorama.needsUpdate = true;
    return panorama;
}
