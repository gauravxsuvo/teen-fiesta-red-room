"use client";
import { createContext, useContext, useEffect, useState } from "react";
const MotionContext = createContext({ reduced: false, systemReduced: false, toggle: () => { } });
export function MotionProvider({ children }: {
    children: React.ReactNode;
}) {
    const [systemReduced, setSystemReduced] = useState(false);
    const [override, setOverride] = useState<boolean | null>(null);
    const reduced = systemReduced || override === true;
    useEffect(() => {
        const query = matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setSystemReduced(query.matches);
        const restore = () => {
            sync();
            try {
                const saved = localStorage.getItem("teen-fiesta-motion");
                if (saved) setOverride(saved === "reduced");
            } catch { /* Browser storage is optional. */ }
        };
        restore();
        window.addEventListener("pageshow", restore);
        query.addEventListener("change", sync);
        return () => { query.removeEventListener("change", sync); window.removeEventListener("pageshow", restore); };
    }, []);
    useEffect(() => {
        document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    }, [reduced]);
    useEffect(() => {
        if (override === null) return;
        try { localStorage.setItem("teen-fiesta-motion", override ? "reduced" : "full"); }
        catch { /* Keep the preference for this page if storage is unavailable. */ }
    }, [override]);
    return <MotionContext.Provider value={{ reduced, systemReduced, toggle: () => setOverride(!reduced) }}>{children}</MotionContext.Provider>;
}
export const useReducedMotion = () => useContext(MotionContext).reduced;
export function MotionToggle() {
    const { reduced, systemReduced, toggle } = useContext(MotionContext);
    return <button className="motion-toggle" type="button" onClick={toggle} aria-label="Reduced motion" aria-pressed={reduced} disabled={systemReduced} title={systemReduced ? "Reduced motion follows your system preference." : undefined}><span className="motion-toggle__label">Motion: {reduced ? "reduced" : "full"}</span><span className="motion-switch" aria-hidden="true"><span /></span></button>;
}
