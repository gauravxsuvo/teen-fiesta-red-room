import * as THREE from "three";
const TAU = Math.PI * 2;
const SEGMENTS = 384;
const SIDES = 32;
// Alternating depth extrema at the four projected crossings of the two bands.
const crossingDepths = [[0.106, 0.86], [0.503, -0.7], [0.685, 0.75], [0.903, -0.76]];
function weaveDepth(u: number) {
    for (let i = 0; i < crossingDepths.length; i += 1) {
        const [start, from] = crossingDepths[i];
        const [next, to] = crossingDepths[(i + 1) % crossingDepths.length];
        const end = next + (i === crossingDepths.length - 1 ? 1 : 0);
        const time = u < start ? u + 1 : u;
        if (time <= end)
            return THREE.MathUtils.lerp(from, to, (1 - Math.cos(Math.PI * (time - start) / (end - start))) / 2);
    }
    return 0;
}
export function createKnotPaths() {
    const horizontal: THREE.Vector3[] = [];
    const rising: THREE.Vector3[] = [];
    for (let i = 0; i < 48; i += 1) {
        const u = i / 48;
        const t = u * TAU;
        horizontal.push(new THREE.Vector3(1.62 * Math.cos(t) * (1 + 0.035 * Math.sin(2 * t)), 0.74 * Math.sin(t) + 0.07 * Math.sin(2 * t) - 0.13, 0.17 * Math.sin(t + 0.3) + 0.035 * Math.sin(3 * t)));
        const x = 0.82 * Math.cos(t);
        const y = 1.36 * Math.sin(t);
        rising.push(new THREE.Vector3(x * Math.cos(0.56) + y * Math.sin(0.56) + 0.07 * Math.cos(2 * t) + 0.08, -x * Math.sin(0.56) + y * Math.cos(0.56) + 0.05 * Math.cos(3 * t) + 0.15
            - 0.16 * Math.exp(-Math.pow((u - 0.8) / 0.07, 4)), weaveDepth(u)));
    }
    return [horizontal, rising].map((points) => {
        const curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
        curve.arcLengthDivisions = 1024;
        return curve;
    });
}
function profile(curve: THREE.CatmullRomCurve3, u: number, wide: number, deep: number) {
    const point = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);
    // Radial frames are periodic and keep the wide oval axis across each band.
    // Projecting off the tangent also handles the rising band's depth changes.
    const normal = new THREE.Vector3(point.x, point.y + 0.04, 0);
    normal.addScaledVector(tangent, -normal.dot(tangent)).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    const roll = Math.sin(u * TAU * 2 + 0.4) * 0.14;
    const axisA = normal.clone().multiplyScalar(Math.cos(roll)).addScaledVector(binormal, Math.sin(roll));
    const axisB = binormal.clone().multiplyScalar(Math.cos(roll)).addScaledVector(normal, -Math.sin(roll));
    const variation = 1 + Math.sin(u * TAU * 3 + 0.35) * 0.055;
    return { point, axisA, axisB, wide: wide * variation, deep: deep * variation };
}
function sweep(curve: THREE.CatmullRomCurve3, wide: number, deep: number) {
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const silver = new THREE.Color("#e7e9ed");
    const ruby = new THREE.Color("#740a20");
    const color = new THREE.Color();
    for (let i = 0; i < SEGMENTS; i += 1) {
        const section = profile(curve, i / SEGMENTS, wide, deep);
        for (let j = 0; j < SIDES; j += 1) {
            const angle = j / SIDES * TAU;
            const position = section.point.clone()
                .addScaledVector(section.axisA, Math.cos(angle) * section.wide)
                .addScaledVector(section.axisB, Math.sin(angle) * section.deep);
            positions.push(position.x, position.y, position.z);
            color.copy(silver).lerp(ruby, Math.pow(Math.max(0, -Math.cos(angle)), 4) * 0.55);
            colors.push(color.r, color.g, color.b);
            const nextI = (i + 1) % SEGMENTS;
            const nextJ = (j + 1) % SIDES;
            const a = i * SIDES + j;
            const b = nextI * SIDES + j;
            const c = nextI * SIDES + nextJ;
            const d = i * SIDES + nextJ;
            indices.push(a, d, b, b, d, c);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    // Wrapped indices share normals at both closed joins; there is no UV seam.
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
}
function insetLight(curve: THREE.CatmullRomCurve3, wide: number, deep: number, start: number, end: number) {
    const positions: number[] = [];
    const indices: number[] = [];
    const count = 110;
    for (let i = 0; i <= count; i += 1) {
        const u = THREE.MathUtils.lerp(start, end, i / count);
        const section = profile(curve, u, wide, deep);
        for (let j = 0; j < 2; j += 1) {
            const angle = Math.PI * 1.25 + (j === 0 ? -0.025 : 0.025);
            const position = section.point.clone()
                .addScaledVector(section.axisA, Math.cos(angle) * (section.wide + 0.0015))
                .addScaledVector(section.axisB, Math.sin(angle) * (section.deep + 0.0015));
            positions.push(position.x, position.y, position.z);
        }
        if (i < count) {
            const a = i * 2;
            indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
}
export function createChromeKnot() {
    const paths = createKnotPaths();
    const bands = [sweep(paths[0], 0.195, 0.125), sweep(paths[1], 0.18, 0.115)];
    const accents = [insetLight(paths[0], 0.195, 0.125, 0.56, 0.88), insetLight(paths[1], 0.18, 0.115, 0.04, 0.22)];
    const chrome = new THREE.MeshPhysicalMaterial({
        color: "#ffffff", vertexColors: true, metalness: 1,
        roughness: 0.065, envMapIntensity: 1.18,
        clearcoat: 0.2, clearcoatRoughness: 0.09,
    });
    const light = new THREE.MeshStandardMaterial({
        color: "#8f001b", emissive: "#f21e3b", emissiveIntensity: 1.2,
        metalness: 0.4, roughness: 0.2, side: THREE.DoubleSide,
    });
    return {
        bands, accents, chrome, light,
        dispose() {
            [...bands, ...accents].forEach((geometry) => geometry.dispose());
            chrome.dispose();
            light.dispose();
        },
    };
}
