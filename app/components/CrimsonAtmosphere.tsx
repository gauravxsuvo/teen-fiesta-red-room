"use client";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
/** ShaderGradient's restrained three-color direction, implemented in the
 * existing R3F canvas so the atmosphere needs no extra renderer or library. */
export default function CrimsonAtmosphere({ reducedMotion }: {
    reducedMotion: boolean;
}) {
    const material = useMemo(() => new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, toneMapped: false,
        uniforms: { uTime: { value: 0 }, color1: { value: new THREE.Color("#050505") }, color2: { value: new THREE.Color("#650316") }, color3: { value: new THREE.Color("#170209") } },
        vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `
      varying vec2 vUv; uniform float uTime; uniform vec3 color1; uniform vec3 color2; uniform vec3 color3;
      void main(){
        vec2 p=vUv-0.5;
        float drift=sin(p.x*5.0+uTime*0.06)*0.08+cos(p.y*4.0-uTime*0.04)*0.06;
        float field=exp(-length(p*vec2(1.1,1.35)+vec2(drift,0.07))*5.5);
        vec3 color=mix(color1,color3,field);color=mix(color,color2,field*field*0.65);
        float alpha=smoothstep(0.58,0.14,length(p))*0.7;
        gl_FragColor=vec4(color,alpha);
        #include <colorspace_fragment>
      }`,
    }), []);
    useEffect(() => () => material.dispose(), [material]);
    useFrame((_state, delta) => {
        if (!reducedMotion)
            material.uniforms.uTime.value += Math.min(delta, 0.05);
    });
    return <mesh position={[0, -0.1, -1.8]} material={material} renderOrder={-1}><planeGeometry args={[7.5, 7.5]}/></mesh>;
}
