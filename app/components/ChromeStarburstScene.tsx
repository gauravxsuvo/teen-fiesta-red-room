"use client";

import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import SculptureFallback from "./SculptureFallback";

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.warn("The RED ROOM chrome starburst fell back to its static artwork.", error);
  }

  render() {
    return this.state.failed ? <SculptureFallback /> : this.props.children;
  }
}

type ArmProfile = {
  angle: number;
  length: number;
  width: number;
  bend: number;
  depth: number;
  twist: number;
  shoulder: number;
};

// Unevenly spaced directions and distinct shoulder positions give the silhouette
// a few long, sweeping blades instead of a uniform ring of spikes.
const ARM_PROFILES: readonly ArmProfile[] = [
  { angle: 163, length: 1.78, width: 0.18, bend: 0.3, depth: -0.34, twist: 0.52, shoulder: 0.26 },
  { angle: 127, length: 1.32, width: 0.2, bend: -0.25, depth: 0.52, twist: -0.38, shoulder: 0.2 },
  { angle: 96, length: 1.92, width: 0.16, bend: 0.2, depth: 0.22, twist: 0.3, shoulder: 0.31 },
  { angle: 59, length: 1.56, width: 0.18, bend: -0.32, depth: -0.48, twist: -0.58, shoulder: 0.23 },
  { angle: 27, length: 1.83, width: 0.17, bend: 0.32, depth: 0.18, twist: 0.62, shoulder: 0.28 },
  { angle: -9, length: 1.2, width: 0.17, bend: -0.2, depth: -0.55, twist: -0.32, shoulder: 0.2 },
  { angle: -43, length: 1.92, width: 0.19, bend: 0.26, depth: 0.42, twist: 0.42, shoulder: 0.3 },
  { angle: -82, length: 1.66, width: 0.18, bend: -0.38, depth: -0.2, twist: -0.52, shoulder: 0.22 },
  { angle: -132, length: 1.4, width: 0.2, bend: 0.22, depth: 0.54, twist: 0.35, shoulder: 0.25 },
  { angle: -174, length: 1.12, width: 0.115, bend: -0.3, depth: -0.42, twist: -0.62, shoulder: 0.19 },
  { angle: -108, length: 1.06, width: 0.11, bend: 0.29, depth: 0.33, twist: 0.58, shoulder: 0.21 },
];

function createSweptArm(profile: ArmProfile) {
  const segments = 52;
  const sides = 20;
  const angle = THREE.MathUtils.degToRad(profile.angle);
  const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
  const crossDirection = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0);
  const depth = new THREE.Vector3(0, 0, profile.depth);
  const start = direction.clone().multiplyScalar(0.14);
  const controlA = direction.clone().multiplyScalar(profile.length * 0.24)
    .addScaledVector(crossDirection, profile.bend * -0.22)
    .addScaledVector(depth, 0.08);
  const controlB = direction.clone().multiplyScalar(profile.length * 0.66)
    .addScaledVector(crossDirection, profile.bend * 0.88)
    .addScaledVector(depth, 0.72);
  const end = direction.clone().multiplyScalar(profile.length)
    .addScaledVector(crossDirection, profile.bend * 1.12)
    .addScaledVector(depth, 1.16);
  const sample = (t: number) => {
    const u = 1 - t;
    return start.clone().multiplyScalar(u * u * u)
      .addScaledVector(controlA, 3 * u * u * t)
      .addScaledVector(controlB, 3 * u * t * t)
      .addScaledVector(end, t * t * t);
  };
  const tangentAt = (t: number) => {
    const u = 1 - t;
    return controlA.clone().sub(start).multiplyScalar(3 * u * u)
      .addScaledVector(controlB.clone().sub(controlA), 6 * u * t)
      .addScaledVector(end.clone().sub(controlB), 3 * t * t)
      .normalize();
  };

  const tipIndex = (segments + 1) * sides;
  const positions = new Float32Array((tipIndex + 1) * 3);
  const indices: number[] = [];
  const worldUp = new THREE.Vector3(0, 0, 1);
  const worldSide = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const rotatedSide = new THREE.Vector3();
  const rotatedNormal = new THREE.Vector3();
  const center = new THREE.Vector3();

  for (let ring = 0; ring <= segments; ring += 1) {
    // Keep the last ring finite and close it to a single controlled tip vertex.
    const t = (ring / segments) * 0.985;
    const tangent = tangentAt(t);
    side.crossVectors(tangent, Math.abs(tangent.dot(worldUp)) > 0.94 ? worldSide : worldUp).normalize();
    normal.crossVectors(side, tangent).normalize();

    const twist = profile.twist * t + Math.sin(t * Math.PI) * 0.12;
    rotatedSide.copy(side).multiplyScalar(Math.cos(twist)).addScaledVector(normal, Math.sin(twist));
    rotatedNormal.copy(normal).multiplyScalar(Math.cos(twist)).addScaledVector(side, -Math.sin(twist));
    center.copy(sample(t));

    const shoulder = Math.exp(-Math.pow((t - profile.shoulder) / 0.16, 2));
    const rootFlare = Math.exp(-Math.pow((t - 0.12) / 0.17, 2));
    const trailingFlare = Math.exp(-Math.pow((t - 0.48) / 0.24, 2));
    const taper = Math.pow(Math.max(0, 1 - t), 0.88);
    const profileScale = taper * (0.34 + shoulder * 0.72 + rootFlare * 0.37 + trailingFlare * 0.18);
    const width = profile.width * profileScale * 1.9;
    const depthWidth = width * (0.27 + 0.06 * Math.sin(t * Math.PI * 2 + angle));

    for (let radial = 0; radial < sides; radial += 1) {
      const theta = (radial / sides) * Math.PI * 2;
      const ridge = 1 + Math.cos(theta * 2 + twist) * 0.075 + Math.cos(theta * 3 + angle) * 0.025;
      const sweptCrest = Math.pow(Math.max(0, Math.cos(theta)), 2) * Math.sin(t * Math.PI) * 0.045;
      const vertex = center.clone()
        .addScaledVector(rotatedSide, Math.cos(theta) * width * (ridge + sweptCrest))
        .addScaledVector(rotatedNormal, Math.sin(theta) * depthWidth * ridge);
      const offset = (ring * sides + radial) * 3;
      positions[offset] = vertex.x;
      positions[offset + 1] = vertex.y;
      positions[offset + 2] = vertex.z;
    }
  }

  for (let ring = 0; ring < segments; ring += 1) {
    for (let radial = 0; radial < sides; radial += 1) {
      const nextRadial = (radial + 1) % sides;
      const a = ring * sides + radial;
      const b = (ring + 1) * sides + radial;
      const c = ring * sides + nextRadial;
      const d = (ring + 1) * sides + nextRadial;
      indices.push(a, b, c, b, d, c);
    }
  }

  const tip = sample(1);
  positions[tipIndex * 3] = tip.x;
  positions[tipIndex * 3 + 1] = tip.y;
  positions[tipIndex * 3 + 2] = tip.z;
  for (let radial = 0; radial < sides; radial += 1) {
    const nextRadial = (radial + 1) % sides;
    indices.push(segments * sides + radial, tipIndex, segments * sides + nextRadial);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createSculptedCore() {
  const geometry = mergeVertices(new THREE.IcosahedronGeometry(0.36, 5), 1e-4);
  const points = geometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();
  const armDirections = ARM_PROFILES.map((profile) => {
    const angle = THREE.MathUtils.degToRad(profile.angle);
    return new THREE.Vector3(Math.cos(angle), Math.sin(angle), profile.depth * 0.48).normalize();
  });

  for (let index = 0; index < points.count; index += 1) {
    vertex.fromBufferAttribute(points, index);
    const direction = vertex.clone().normalize();
    const asymmetry = (
      Math.sin(direction.x * 3.1 + direction.y * 1.8 - direction.z * 2.4) *
      Math.cos(direction.z * 2.8 - direction.x * 1.6) * 0.052 +
      Math.sin(direction.y * 4.2 + direction.z * 1.7) * 0.031 +
      Math.sin(direction.x * 5.2 - direction.y * 2.7 + direction.z * 1.9) * 0.016
    );
    const rootShoulders = armDirections.reduce((sum, armDirection, armIndex) => {
      const alignment = Math.max(0, direction.dot(armDirection));
      const shoulder = Math.exp(-Math.pow((1 - alignment) / 0.16, 2));
      return sum + shoulder * (0.105 + ARM_PROFILES[armIndex].width * 0.62);
    }, 0);
    vertex.copy(direction).multiplyScalar(0.26 + asymmetry + Math.min(rootShoulders * 0.33, 0.12));
    points.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createStudioPanorama() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const base = context.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, "#35363a");
  base.addColorStop(0.17, "#18191c");
  base.addColorStop(0.4, "#090a0c");
  base.addColorStop(0.6, "#17181b");
  base.addColorStop(0.82, "#292a2e");
  base.addColorStop(1, "#101114");
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const addSoftbox = (x: number, width: number, y: number, height: number, strength = 1) => {
    const panel = context.createLinearGradient(x, 0, x + width, 0);
    panel.addColorStop(0, "rgba(255,255,255,0)");
    panel.addColorStop(0.18, `rgba(223,226,232,${0.11 * strength})`);
    panel.addColorStop(0.38, `rgba(255,255,255,${0.9 * strength})`);
    panel.addColorStop(0.62, `rgba(231,233,239,${0.58 * strength})`);
    panel.addColorStop(0.88, `rgba(255,255,255,${0.12 * strength})`);
    panel.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = panel;
    context.fillRect(x, y, width, height);
  };

  addSoftbox(58, 38, 20, 440, 0.92);
  addSoftbox(259, 28, 0, 310, 0.82);
  addSoftbox(438, 48, 46, 430, 1.02);
  addSoftbox(679, 32, 0, 340, 0.9);
  addSoftbox(816, 54, 36, 270, 0.72);
  addSoftbox(952, 28, 64, 374, 0.84);

  const ceiling = context.createLinearGradient(0, 0, 0, 56);
  ceiling.addColorStop(0, "rgba(255,255,255,0.68)");
  ceiling.addColorStop(0.18, "rgba(241,243,247,0.42)");
  ceiling.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = ceiling;
  context.fillRect(176, 0, 338, 56);

  const lowerStrip = context.createLinearGradient(0, 0, 0, 20);
  lowerStrip.addColorStop(0, "rgba(255,255,255,0)");
  lowerStrip.addColorStop(0.58, "rgba(241,243,247,0.22)");
  lowerStrip.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = lowerStrip;
  context.fillRect(500, 408, 280, 20);

  const crimson = context.createLinearGradient(0, 242, 0, 446);
  crimson.addColorStop(0, "rgba(132,8,22,0)");
  crimson.addColorStop(0.38, "rgba(160,13,31,0.36)");
  crimson.addColorStop(0.72, "rgba(224,38,52,0.5)");
  crimson.addColorStop(1, "rgba(70,4,14,0)");
  context.fillStyle = crimson;
  context.fillRect(792, 242, 42, 204);

  const crimsonEdge = context.createLinearGradient(760, 0, 794, 0);
  crimsonEdge.addColorStop(0, "rgba(239,52,57,0)");
  crimsonEdge.addColorStop(0.52, "rgba(224,38,52,0.48)");
  crimsonEdge.addColorStop(1, "rgba(239,52,57,0)");
  context.fillStyle = crimsonEdge;
  context.fillRect(760, 110, 24, 330);

  context.fillStyle = "rgba(255,255,255,0.16)";
  context.fillRect(206, 0, 2, 512);
  context.fillRect(562, 42, 1, 430);
  context.fillStyle = "rgba(255,255,255,0.1)";
  context.fillRect(0, 152, 1024, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();

  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    generator.compileEquirectangularShader();
    const panorama = createStudioPanorama();
    let room: RoomEnvironment | null = null;
    const target = panorama
      ? generator.fromEquirectangular(panorama)
      : generator.fromScene((room = new RoomEnvironment()), 0.04);
    const previous = scene.environment;
    scene.environment = target.texture;
    invalidate();

    return () => {
      scene.environment = previous;
      target.dispose();
      panorama?.dispose();
      generator.dispose();
      room?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [gl, scene, invalidate]);

  return null;
}

const INITIAL_ROTATION: [number, number, number] = [0.28, -0.38, 0.1];

type PointerMotion = {
  rotationX: number;
  rotationY: number;
  x: number;
  y: number;
  proximity: number;
};

const ZERO_POINTER_MOTION: PointerMotion = {
  rotationX: 0,
  rotationY: 0,
  x: 0,
  y: 0,
  proximity: 0,
};

function ChromeStarburst({
  reducedMotion,
  compact,
  pointerEnabled,
  entered,
}: {
  reducedMotion: boolean;
  compact: boolean;
  pointerEnabled: boolean;
  entered: boolean;
}) {
  const scrollGroup = useRef<THREE.Group>(null);
  const idleGroup = useRef<THREE.Group>(null);
  const pointerGroup = useRef<THREE.Group>(null);
  const sculpture = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const redLight = useRef<THREE.PointLight>(null);
  const fillLight = useRef<THREE.PointLight>(null);
  const invalidate = useThree((state) => state.invalidate);
  const idleTime = useRef(0);
  const pointerTarget = useRef<PointerMotion>({ ...ZERO_POINTER_MOTION });
  const pointerCurrent = useRef<PointerMotion>({ ...ZERO_POINTER_MOTION });
  const coreGeometry = useMemo(createSculptedCore, []);
  const armGeometries = useMemo(() => ARM_PROFILES.map(createSweptArm), []);
  const coreMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#47494e",
    metalness: 1,
    roughness: 0.115,
    clearcoat: 1,
    clearcoatRoughness: 0.055,
    envMapIntensity: 2.15,
  }), []);
  const armMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#e4e6ea",
    metalness: 1,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.075,
    envMapIntensity: 3.05,
  }), []);

  useEffect(() => () => {
    coreGeometry.dispose();
    armGeometries.forEach((geometry) => geometry.dispose());
    coreMaterial.dispose();
    armMaterial.dispose();
  }, [coreGeometry, armGeometries, coreMaterial, armMaterial]);

  useFrame((_state, delta) => {
    if (reducedMotion) return;

    const frameDelta = Math.min(delta, 0.05);
    if (frameDelta <= 0) return;
    idleTime.current += frameDelta;
    const time = idleTime.current;
    const idle = idleGroup.current;
    const pointer = pointerGroup.current;
    const target = pointerTarget.current;
    const current = pointerCurrent.current;

    if (idle) {
      idle.rotation.set(
        Math.sin(time * 0.21) * 0.045,
        Math.sin(time * 0.17 + 0.55) * 0.075,
        Math.sin(time * 0.27 + 1.1) * 0.032,
      );
      idle.position.set(
        Math.sin(time * 0.31) * 0.009,
        Math.sin(time * 0.43 + 0.8) * 0.018,
        Math.sin(time * 0.24 + 0.3) * 0.006,
      );
    }

    const damping = 1 - Math.exp(-frameDelta * 5.2);
    current.rotationX += (target.rotationX - current.rotationX) * damping;
    current.rotationY += (target.rotationY - current.rotationY) * damping;
    current.x += (target.x - current.x) * damping;
    current.y += (target.y - current.y) * damping;
    current.proximity += (target.proximity - current.proximity) * damping;

    if (pointer) {
      pointer.rotation.set(current.rotationX, current.rotationY, 0);
      pointer.position.set(current.x, current.y, 0);
    }

    const reflectiveBreath = 0.5 + Math.sin(time * 0.24 + 0.4) * 0.5;
    if (keyLight.current) keyLight.current.intensity = 2.85 + reflectiveBreath * 0.18;
    if (redLight.current) redLight.current.intensity = 1.05 + reflectiveBreath * 0.08 + current.proximity * 0.12;
    if (fillLight.current) {
      fillLight.current.position.x = -2.7 + current.x * 0.36;
      fillLight.current.position.y = -1.8 + current.y * 0.3;
    }
  });

  useEffect(() => {
    if (!pointerEnabled || reducedMotion) {
      pointerTarget.current = { ...ZERO_POINTER_MOTION };
      return;
    }

    const hero = document.querySelector<HTMLElement>(".hero");
    const object = document.querySelector<HTMLElement>(".hero__object");
    if (!hero || !object) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const heroBounds = hero.getBoundingClientRect();
      const objectBounds = object.getBoundingClientRect();
      if (heroBounds.width <= 0 || heroBounds.height <= 0 || objectBounds.width <= 0 || objectBounds.height <= 0) return;

      const normalizedX = THREE.MathUtils.clamp(((event.clientX - heroBounds.left) / heroBounds.width) * 2 - 1, -1, 1);
      const normalizedY = THREE.MathUtils.clamp(1 - ((event.clientY - heroBounds.top) / heroBounds.height) * 2, -1, 1);
      const distanceX = (event.clientX - (objectBounds.left + objectBounds.width * 0.5)) / (objectBounds.width * 0.72);
      const distanceY = (event.clientY - (objectBounds.top + objectBounds.height * 0.5)) / (objectBounds.height * 0.72);
      const proximity = THREE.MathUtils.clamp(1 - Math.hypot(distanceX, distanceY), 0, 1);
      const response = 0.68 + proximity * 0.32;

      pointerTarget.current.rotationX = THREE.MathUtils.clamp(-normalizedY * 0.12 * response, -0.16, 0.16);
      pointerTarget.current.rotationY = THREE.MathUtils.clamp(normalizedX * 0.145 * response, -0.18, 0.18);
      pointerTarget.current.x = normalizedX * 0.026 * response;
      pointerTarget.current.y = normalizedY * 0.02 * response;
      pointerTarget.current.proximity = proximity;
    };

    const leave = () => {
      pointerTarget.current = { ...ZERO_POINTER_MOTION };
    };

    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      leave();
    };
  }, [pointerEnabled, reducedMotion]);

  useEffect(() => {
    const rootGroup = scrollGroup.current;
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!rootGroup || !hero) return;

    gsap.registerPlugin(ScrollTrigger);
    const scaleBase = compact ? 0.68 : 1.1;
    const restoreInitial = () => {
      rootGroup.rotation.set(...INITIAL_ROTATION);
      rootGroup.position.set(0, 0, 0);
      rootGroup.scale.setScalar(scaleBase);
      invalidate();
    };

    if (!entered || reducedMotion) {
      restoreInitial();
      return;
    }

    const context = gsap.context(() => {
      const applyProgress = (progress: number) => {
        rootGroup.rotation.set(
          INITIAL_ROTATION[0] + progress * 0.34,
          INITIAL_ROTATION[1] + progress * 0.5,
          INITIAL_ROTATION[2] - progress * 0.22,
        );
        rootGroup.position.set(0.02 + progress * 0.14, 0.01 - progress * 0.13, 0);
        rootGroup.scale.setScalar(scaleBase * (1 - progress * 0.11));
        invalidate();
      };

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.68,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyProgress(self.progress),
        onRefresh: (self) => applyProgress(self.progress),
      });
    }, hero);

    return () => context.revert();
  }, [compact, entered, invalidate, reducedMotion]);

  useEffect(() => {
    const figure = sculpture.current;
    if (!figure) return;

    if (!entered || reducedMotion) {
      figure.scale.setScalar(1);
      figure.rotation.set(0, 0, 0);
      figure.position.set(0, 0, 0);
      invalidate();
      return;
    }

    const context = gsap.context(() => {
      const entrance = gsap.timeline({ onUpdate: invalidate });
      entrance
        .fromTo(figure.scale, { x: 0.9, y: 0.9, z: 0.9 }, { x: 1, y: 1, z: 1, duration: 0.76, ease: "power3.out" }, 0)
        .fromTo(figure.rotation, { x: -0.07, y: -0.14, z: 0.04 }, { x: 0, y: 0, z: 0, duration: 0.82, ease: "power2.out" }, 0)
        .fromTo(figure.position, { x: 0, y: -0.035, z: -0.07 }, { x: 0, y: 0, z: 0, duration: 0.78, ease: "power2.out" }, 0);
    });

    return () => context.revert();
  }, [entered, invalidate, reducedMotion]);

  return (
    <>
      <ambientLight color="#c8c9cd" intensity={0.3} />
      <directionalLight ref={keyLight} position={[-3.2, 3.4, 4.6]} color="#ffffff" intensity={2.95} />
      <directionalLight position={[0.2, 1.1, 4.8]} color="#f4f5f8" intensity={1.6} />
      <directionalLight position={[3.5, 0.7, -3.6]} color="#e1e4eb" intensity={1.25} />
      <pointLight ref={redLight} position={[2.1, 0.35, 2.3]} color="#ef3439" intensity={1.05} distance={5.8} decay={2} />
      <pointLight ref={fillLight} position={[-2.7, -1.8, -2.4]} color="#e6e8ed" intensity={2.8} distance={7} decay={2} />
      <pointLight position={[0.6, -2.1, -2.4]} color="#8f0718" intensity={0.34} distance={4.2} decay={2} />
      <group ref={scrollGroup} rotation={INITIAL_ROTATION} scale={compact ? 0.68 : 1.1}>
        <group ref={idleGroup}>
          <group ref={pointerGroup}>
            <group ref={sculpture}>
              {armGeometries.map((geometry, index) => (
                <mesh
                  key={index}
                  geometry={geometry}
                  material={armMaterial}
                  castShadow={false}
                  receiveShadow={false}
                />
              ))}
              <mesh geometry={coreGeometry} material={coreMaterial} castShadow={false} receiveShadow={false} />
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

function Scene({ reducedMotion, compact, pointerEnabled, entered }: {
  reducedMotion: boolean;
  compact: boolean;
  pointerEnabled: boolean;
  entered: boolean;
}) {
  return (
    <>
      <StudioEnvironment />
      <ChromeStarburst reducedMotion={reducedMotion} compact={compact} pointerEnabled={pointerEnabled} entered={entered} />
    </>
  );
}

export default function ChromeStarburstScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 760px)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setCompact(compactQuery.matches);
      setFinePointer(pointerQuery.matches);
    };
    sync();
    motionQuery.addEventListener("change", sync);
    compactQuery.addEventListener("change", sync);
    pointerQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      compactQuery.removeEventListener("change", sync);
      pointerQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const object = document.querySelector<HTMLElement>(".hero__object");
    if (!object) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      setInView(visible);
      if (visible) setEntered(true);
    }, { threshold: 0.01 });
    observer.observe(object);

    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  const animate = inView && pageVisible && !reducedMotion;
  const pointerEnabled = finePointer && !reducedMotion;

  return (
    <WebGLErrorBoundary>
      <Canvas
        aria-hidden="true"
        dpr={compact ? 1 : [1, 1.25]}
        frameloop={animate ? "always" : "demand"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, compact ? 5 : 4.65], fov: 43 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        fallback={<SculptureFallback />}
      >
        <Scene reducedMotion={reducedMotion} compact={compact} pointerEnabled={pointerEnabled} entered={entered} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
