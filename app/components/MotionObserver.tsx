"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionObserver() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const heroEntrance = gsap.utils.toArray<HTMLElement>(".hero__copy > *, .hero__topline, .hero__bottomline");
      if (heroEntrance.length) {
        gsap.fromTo(
          heroEntrance,
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.82, stagger: 0.075, ease: "power3.out", delay: 0.12 },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 26, autoAlpha: 0, clipPath: "inset(0 0 8% 0)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      const hero = document.querySelector<HTMLElement>(".hero");
      const backdrop = document.querySelector<HTMLElement>(".hero__backdrop");
      if (hero && backdrop) {
        gsap.to(backdrop, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
        });
      }
    });

    return () => context.revert();
  }, []);

  return null;
}
