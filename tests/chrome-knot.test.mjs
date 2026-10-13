import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import * as THREE from "three";

// Execute the real geometry factory without introducing another test runtime.
const source = readFileSync(new URL("../app/components/chrome-knot-geometry.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const geometryModule = {};
new Function("require", "exports", compiled)((name) => {
  assert.equal(name, "three");
  return THREE;
}, geometryModule);

test("both swept bands are closed manifolds with finite unit normals", () => {
  const knot = geometryModule.createChromeKnot();
  try {
    let triangles = 0;
    for (const band of knot.bands) {
      const edges = new Map();
      const index = band.index.array;
      triangles += index.length / 3;
      for (let i = 0; i < index.length; i += 3) {
        const face = [index[i], index[i + 1], index[i + 2]];
        assert.equal(new Set(face).size, 3);
        for (let side = 0; side < 3; side++) {
          const a = face[side], b = face[(side + 1) % 3];
          const key = `${Math.min(a, b)},${Math.max(a, b)}`;
          const edge = edges.get(key) ?? { count: 0, direction: 0 };
          edge.count++;
          edge.direction += a < b ? 1 : -1;
          edges.set(key, edge);
        }
      }
      for (const edge of edges.values()) {
        assert.equal(edge.count, 2, "open or non-manifold edge");
        assert.equal(edge.direction, 0, "inconsistent face winding");
      }
      const normals = band.attributes.normal;
      for (let i = 0; i < normals.count; i++) {
        const length = Math.hypot(normals.getX(i), normals.getY(i), normals.getZ(i));
        assert.ok(Number.isFinite(length) && Math.abs(length - 1) < 0.00001);
      }
      assert.ok([...band.attributes.position.array].every(Number.isFinite));
    }
    assert.ok(triangles < 60000, "geometry budget exceeded");
  } finally { knot.dispose(); }
});

test("crossings have clearance and both paths close smoothly", () => {
  const paths = geometryModule.createKnotPaths();
  for (const path of paths) {
    assert.ok(path.getPoint(0).distanceTo(path.getPoint(1)) < 0.000001);
    assert.ok(path.getTangent(0).dot(path.getTangent(1)) > 0.999);
  }
  const points = paths.map(path => Array.from({ length: 600 }, (_, i) => path.getPointAt(i / 600)));
  let separation = Infinity;
  for (const a of points[0]) for (const b of points[1]) separation = Math.min(separation, a.distanceTo(b));
  // A conservative sphere bound is wider than either oval profile. Clearance
  // above this bound prevents contact regardless of camera or group rotation.
  assert.ok(separation > 0.42, `insufficient separation: ${separation}`);
});
