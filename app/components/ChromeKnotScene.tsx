"use client";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { createChromeKnot } from "./chrome-knot-geometry";
import { createChromeStudio } from "./chrome-knot-studio";
import CrimsonAtmosphere from "./CrimsonAtmosphere";
import { useReducedMotion } from "./MotionSettings";
import SculptureFallback from "./SculptureFallback";
class WebGLErrorBoundary extends Component<{
    children: ReactNode;
}, {
    failed: boolean;
}> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    componentDidCatch(error: Error, _info: ErrorInfo) {
        console.warn("The RED ROOM chrome knot fell back to its static artwork.", error);
    }
    render() {
        return this.state.failed ? <SculptureFallback /> : this.props.children;
    }
}
function StudioEnvironment() {
    const { gl, scene, invalidate } = useThree();
    useEffect(() => {
        const generator = new THREE.PMREMGenerator(gl);
        const studio = createChromeStudio();
        const target = generator.fromEquirectangular(studio);
        studio.dispose();
        generator.dispose();
        const previous = scene.environment;
        scene.environment = target.texture;
        invalidate();
        return () => {
            scene.environment = previous;
            target.dispose();
        };
    }, [gl, scene, invalidate]);
    return null;
}
const INITIAL_ROTATION: [
    number,
    number,
    number
] = [0.12, -0.12, -0.09];
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
function ChromeKnot({ reducedMotion, compact, pointerEnabled, entered, }: {
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
    const knot = useMemo(createChromeKnot, []);
    useEffect(() => () => {
        knot.dispose();
    }, [knot]);
    useEffect(() => {
        if (!reducedMotion)
            return;
        idleGroup.current?.rotation.set(0, 0, 0);
        idleGroup.current?.position.set(0, 0, 0);
        pointerGroup.current?.rotation.set(0, 0, 0);
        pointerGroup.current?.position.set(0, 0, 0);
        pointerCurrent.current = { ...ZERO_POINTER_MOTION };
        invalidate();
    }, [invalidate, reducedMotion]);
    useFrame((_state, delta) => {
        if (reducedMotion)
            return;
        const frameDelta = Math.min(delta, 0.05);
        if (frameDelta <= 0)
            return;
        idleTime.current += frameDelta;
        const time = idleTime.current;
        const idle = idleGroup.current;
        const pointer = pointerGroup.current;
        const target = pointerTarget.current;
        const current = pointerCurrent.current;
        if (idle) {
            idle.rotation.set(Math.sin(time * 0.21) * 0.025, Math.sin(time * 0.17 + 0.55) * 0.04, Math.sin(time * 0.27 + 1.1) * 0.02);
            idle.position.set(Math.sin(time * 0.31) * 0.009, Math.sin(time * 0.43 + 0.8) * 0.025, Math.sin(time * 0.24 + 0.3) * 0.006);
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
        if (keyLight.current)
            keyLight.current.intensity = 0.7 + reflectiveBreath * 0.08;
        if (redLight.current)
            redLight.current.intensity = 0.55 + reflectiveBreath * 0.06 + current.proximity * 0.08;
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
        if (!hero || !object)
            return;
        const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" && event.pointerType !== "pen")
                return;
            const heroBounds = hero.getBoundingClientRect();
            const objectBounds = object.getBoundingClientRect();
            if (heroBounds.width <= 0 || heroBounds.height <= 0 || objectBounds.width <= 0 || objectBounds.height <= 0)
                return;
            const normalizedX = THREE.MathUtils.clamp(((event.clientX - heroBounds.left) / heroBounds.width) * 2 - 1, -1, 1);
            const normalizedY = THREE.MathUtils.clamp(1 - ((event.clientY - heroBounds.top) / heroBounds.height) * 2, -1, 1);
            const distanceX = (event.clientX - (objectBounds.left + objectBounds.width * 0.5)) / (objectBounds.width * 0.72);
            const distanceY = (event.clientY - (objectBounds.top + objectBounds.height * 0.5)) / (objectBounds.height * 0.72);
            const proximity = THREE.MathUtils.clamp(1 - Math.hypot(distanceX, distanceY), 0, 1);
            const response = 0.68 + proximity * 0.32;
            pointerTarget.current.rotationX = -normalizedY * 0.07 * response;
            pointerTarget.current.rotationY = normalizedX * 0.09 * response;
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
        if (!rootGroup || !hero)
            return;
        gsap.registerPlugin(ScrollTrigger);
        const scaleBase = compact ? 0.94 : 1.03;
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
                rootGroup.rotation.set(INITIAL_ROTATION[0] + progress * 0.12, INITIAL_ROTATION[1] + progress * 0.22, INITIAL_ROTATION[2] - progress * 0.08);
                rootGroup.position.set(0, -progress * 0.09, 0);
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
        if (!figure)
            return;
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
    return (<>
      <ambientLight color="#c8c9cd" intensity={0.05}/>
      <directionalLight ref={keyLight} position={[-3.2, 3.4, 4.6]} color="#ffffff" intensity={0.75}/>
      <pointLight ref={redLight} position={[2.1, 0.35, 2.3]} color="#ef0929" intensity={0.6} distance={5.8} decay={2}/>
      <pointLight ref={fillLight} position={[-2.7, -1.8, -2.4]} color="#e6e8ed" intensity={0.35} distance={7} decay={2}/>
      <group ref={scrollGroup} rotation={INITIAL_ROTATION} scale={compact ? 0.94 : 1.03}>
        <group ref={idleGroup}>
          <group ref={pointerGroup}>
            <group ref={sculpture}>
              {knot.bands.map((geometry, index) => <mesh key={index} geometry={geometry} material={knot.chrome}/>)}
              {knot.accents.map((geometry, index) => <mesh key={index} geometry={geometry} material={knot.light}/>)}
            </group>
          </group>
        </group>
      </group>
    </>);
}
function Scene({ reducedMotion, compact, pointerEnabled, entered }: {
    reducedMotion: boolean;
    compact: boolean;
    pointerEnabled: boolean;
    entered: boolean;
}) {
    return (<>
      <StudioEnvironment />
      <CrimsonAtmosphere reducedMotion={reducedMotion}/>
      <ChromeKnot reducedMotion={reducedMotion} compact={compact} pointerEnabled={pointerEnabled} entered={entered}/>
    </>);
}
export default function ChromeKnotScene() {
    const reducedMotion = useReducedMotion();
    const [compact, setCompact] = useState(false);
    const [finePointer, setFinePointer] = useState(false);
    const [inView, setInView] = useState(false);
    const [pageVisible, setPageVisible] = useState(true);
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const compactQuery = window.matchMedia("(max-width: 760px)");
        const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
        const sync = () => {
            setCompact(compactQuery.matches);
            setFinePointer(pointerQuery.matches);
        };
        sync();
        compactQuery.addEventListener("change", sync);
        pointerQuery.addEventListener("change", sync);
        return () => {
            compactQuery.removeEventListener("change", sync);
            pointerQuery.removeEventListener("change", sync);
        };
    }, []);
    useEffect(() => {
        const object = document.querySelector<HTMLElement>(".hero__object");
        if (!object)
            return;
        if (!("IntersectionObserver" in window)) {
            setInView(true);
            setEntered(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            const visible = entry.isIntersecting;
            setInView(visible);
            if (visible)
                setEntered(true);
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
    return (<WebGLErrorBoundary>
      <Canvas aria-hidden="true" dpr={compact ? 1 : [1, 1.25]} frameloop={animate ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} camera={{ position: [0, 0, compact ? 5.1 : 5.7], fov: 43 }} onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.94;
            gl.outputColorSpace = THREE.SRGBColorSpace;
        }} fallback={<SculptureFallback />}>
        <Scene reducedMotion={reducedMotion} compact={compact} pointerEnabled={pointerEnabled} entered={entered}/>
      </Canvas>
    </WebGLErrorBoundary>);
}
