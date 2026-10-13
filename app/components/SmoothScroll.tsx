"use client";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./MotionSettings";
const ScrollContext = createContext({ lock: () => () => { } });
export default function SmoothScroll({ children }: {
    children: React.ReactNode;
}) {
    const engine = useRef<Lenis | null>(null);
    const locks = useRef(0);
    const previousOverflow = useRef("");
    const reduced = useReducedMotion();
    const reducedRef = useRef(reduced);
    const pathname = usePathname();
    useEffect(() => { reducedRef.current = reduced; }, [reduced]);
    const context = useMemo(() => ({
        lock: () => {
            if (locks.current++ === 0) {
                previousOverflow.current = document.documentElement.style.overflow;
                engine.current?.stop();
                document.documentElement.style.overflow = "hidden";
            }
            let released = false;
            return () => {
                if (released)
                    return;
                released = true;
                if (--locks.current === 0) {
                    document.documentElement.style.overflow = previousOverflow.current;
                    engine.current?.start();
                }
            };
        },
    }), []);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({
            autoRaf: false, lerp: 0.115, smoothWheel: true, syncTouch: false,
            anchors: false, respectReducedMotion: true, stopInertiaOnNavigate: true,
            prevent: (node) => node.hasAttribute("data-lenis-prevent"),
            virtualScroll: () => !reducedRef.current,
        });
        engine.current = lenis;
        if (locks.current)
            lenis.stop();
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const targetFor = (hash: string) => {
            try {
                return document.getElementById(decodeURIComponent(hash.slice(1)));
            }
            catch {
                return null;
            }
        };
        const focus = (target: HTMLElement) => {
            const existing = target.getAttribute("tabindex");
            if (existing === null)
                target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
            if (existing === null)
                target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        };
        // Delegated anchors preserve hashes/history and wait for dialog locks to release.
        // Lenis's built-in anchor listener is disabled to avoid a second scroll owner.
        let anchorFrame: number | null = null;
        const anchor = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
                return;
            const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
            if (!link || link.target === "_blank" || link.hasAttribute("download"))
                return;
            const url = new URL(link.href);
            if (url.origin !== location.origin || url.pathname.replace(/\/$/, "") !== location.pathname.replace(/\/$/, "") || !url.hash)
                return;
            const target = targetFor(url.hash);
            if (!target)
                return;
            event.preventDefault();
            if (location.hash !== url.hash) history.pushState(null, "", url.hash);
            if (anchorFrame !== null) cancelAnimationFrame(anchorFrame);
            anchorFrame = requestAnimationFrame(() => {
                anchorFrame = null;
                // Lenis reads CSS scroll-padding-top itself; applying another offset doubles it.
                lenis.scrollTo(target, { immediate: reducedRef.current || link.classList.contains("skip-link"), force: true, onComplete: () => focus(target) });
            });
        };
        const hash = () => {
            const target = targetFor(location.hash);
            if (target) {
                lenis.resize();
                lenis.scrollTo(target, { immediate: true, force: true });
            }
        };
        const initialFrame = requestAnimationFrame(hash);
        document.addEventListener("click", anchor);
        window.addEventListener("hashchange", hash);
        window.addEventListener("popstate", hash);
        return () => {
            cancelAnimationFrame(initialFrame);
            if (anchorFrame !== null) cancelAnimationFrame(anchorFrame);
            document.removeEventListener("click", anchor);
            window.removeEventListener("hashchange", hash);
            window.removeEventListener("popstate", hash);
            gsap.ticker.remove(tick);
            lenis.off("scroll", ScrollTrigger.update);
            lenis.destroy();
            engine.current = null;
        };
    }, []);
    useEffect(() => {
        const frame = requestAnimationFrame(() => { engine.current?.resize(); ScrollTrigger.refresh(); });
        return () => cancelAnimationFrame(frame);
    }, [pathname]);
    return <ScrollContext.Provider value={context}>{children}</ScrollContext.Provider>;
}
export function useOverlayLock(open: boolean) {
    const { lock } = useContext(ScrollContext);
    useEffect(() => { if (open)
        return lock(); }, [open, lock]);
}
