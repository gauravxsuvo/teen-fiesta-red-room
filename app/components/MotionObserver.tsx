"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./MotionSettings";
export default function MotionObserver() {
    const reduced = useReducedMotion();
    useEffect(() => {
        if (reduced || matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
            const heroEntrance = gsap.utils.toArray<HTMLElement>(".hero__heading > *, .hero__message > *");
            if (heroEntrance.length) gsap.fromTo(heroEntrance, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.065, ease: "power3.out", delay: 0.05 });
            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
                gsap.fromTo(element, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 92%", once: true } });
            });
            gsap.utils.toArray<HTMLElement>("[data-media-reveal]").forEach(element => {
                gsap.fromTo(element, { clipPath: "inset(6% 0 6% 0)", y: 16 }, { clipPath: "inset(0% 0 0% 0)", y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } });
            });
            const backdrop = document.querySelector(".hero__backdrop");
            if (backdrop)
                gsap.to(backdrop, { yPercent: 4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } });
        });
        ScrollTrigger.refresh();
        return () => context.revert();
    }, [reduced]);
    return null;
}
