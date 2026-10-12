"use client";

import { useEffect } from "react";

export default function MotionObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduced.matches || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
