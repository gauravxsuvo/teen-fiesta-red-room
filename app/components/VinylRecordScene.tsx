"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import SculptureFallback from "./SculptureFallback";

class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.warn("The 3D record fell back to its SVG artwork.", error);
  }

  render() {
    return this.state.failed ? <SculptureFallback /> : this.props.children;
  }
}

function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = generator.fromScene(room, 0.04);
    const previous = scene.environment;
    scene.environment = target.texture;

    return () => {
      scene.environment = previous;
      target.dispose();
      generator.dispose();
      room.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [gl, scene]);

  return null;
}

function VinylRecord({ reduced }: { reduced: boolean }) {
  const record = useRef<THREE.Group>(null);
  const time = useRef(0);
  const geometries = useMemo(() => {
    const radii = Array.from({ length: 25 }, (_, index) => 0.43 + index * 0.024);
    return {
      disc: new THREE.CylinderGeometry(1.03, 1.03, 0.075, 128),
      grooves: radii.map((radius) => new THREE.TorusGeometry(radius, 0.0035, 6, 128)),
      rim: new THREE.TorusGeometry(1.035, 0.015, 10, 128),
      label: new THREE.CylinderGeometry(0.34, 0.34, 0.014, 96),
      labelRing: new THREE.TorusGeometry(0.294, 0.005, 6, 96),
      spindle: new THREE.CylinderGeometry(0.052, 0.052, 0.018, 32),
    };
  }, []);

  useEffect(() => () => {
    geometries.disc.dispose();
    geometries.grooves.forEach((geometry) => geometry.dispose());
    geometries.rim.dispose();
    geometries.label.dispose();
    geometries.labelRing.dispose();
    geometries.spindle.dispose();
  }, [geometries]);

  useFrame((_, delta) => {
    if (!record.current || reduced) return;
    time.current += delta;
    record.current.rotation.z += delta * 0.14;
    record.current.rotation.x = -0.16 + Math.sin(time.current * 0.45) * 0.035;
    record.current.rotation.y = 0.12 + Math.cos(time.current * 0.35) * 0.045;
    record.current.position.y = Math.sin(time.current * 0.6) * 0.035;
  });

  return (
    <group ref={record} rotation={[0.08, 0.12, 0]}>
      <mesh geometry={geometries.disc} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#090a0c" metalness={0} roughness={0.84} />
      </mesh>
      {geometries.grooves.map((geometry, index) => (
        <mesh key={index} geometry={geometry} position={[0, 0, 0.041]}>
          <meshBasicMaterial color={index % 3 === 0 ? "#484a4e" : "#292b2f"} />
        </mesh>
      ))}
      <mesh geometry={geometries.rim} position={[0, 0, 0.012]}>
        <meshBasicMaterial color="#66686d" />
      </mesh>
      <mesh geometry={geometries.label} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.044]}>
        <meshBasicMaterial color="#e62d3a" />
      </mesh>
      <mesh geometry={geometries.labelRing} position={[0, 0, 0.054]}>
        <meshBasicMaterial color="#f4f4f2" />
      </mesh>
      <mesh geometry={geometries.spindle} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.055]}>
        <meshBasicMaterial color="#111112" />
      </mesh>
    </group>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <StudioEnvironment />
      <ambientLight intensity={0.72} />
      <directionalLight position={[-3.8, 4.4, 4]} color="#fff8f4" intensity={2.6} />
      <pointLight position={[3.2, 0.3, 2.4]} color="#ff3449" intensity={7} distance={8} />
      <pointLight position={[-3, -2.4, -1.5]} color="#d0d0d4" intensity={5} distance={7} />
      <Suspense fallback={null}>
        <VinylRecord reduced={reduced} />
      </Suspense>
    </>
  );
}

export default function VinylRecordScene() {
  const [reduced, setReduced] = useState(false);
  const [staticDevice, setStaticDevice] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const sync = () => {
      setReduced(motionQuery.matches);
      setStaticDevice(mobileQuery.matches);
    };
    sync();
    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
    };
  }, []);

  return (
    <WebGLErrorBoundary>
      <Canvas
        aria-hidden="true"
        dpr={[1, 1.35]}
        frameloop={reduced || staticDevice ? "demand" : "always"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        fallback={<SculptureFallback />}
      >
        <Scene reduced={reduced || staticDevice} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
