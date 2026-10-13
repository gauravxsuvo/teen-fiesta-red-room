"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useOverlayLock } from "./SmoothScroll";
import SculptureFallback from "./SculptureFallback";
const links = [
    { href: "/#experience", label: "Experience" },
    { href: "/#event-details", label: "Details" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/#aftermovie", label: "Film" },
];
export default function Navigation() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("");
    const dialog = useRef<HTMLDialogElement>(null);
    const pathname = usePathname();
    useOverlayLock(open);
    useEffect(() => {
        if (open && !dialog.current?.open)
            dialog.current?.showModal();
        if (!open && dialog.current?.open)
            dialog.current?.close();
    }, [open]);
    useEffect(() => {
        const sync = () => setScrolled(scrollY > 40);
        sync();
        addEventListener("scroll", sync, { passive: true });
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries)
                if (entry.isIntersecting)
                    setActive(entry.target.id);
        }, { rootMargin: "-15% 0px -65% 0px" });
        document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
        return () => { removeEventListener("scroll", sync); observer.disconnect(); };
    }, [pathname]);
    return <>
    <header className={`site-header${scrolled || pathname.startsWith("/pricing") ? " site-header--solid" : ""}`}>
      <div className="site-header__inner page-shell">
        <a className="wordmark" href="/#top" aria-label="Teen Fiesta home"><Image className="wordmark__seal" src="/media/teen-fiesta-monogram.png" alt="" width={48} height={48} preload/><span className="wordmark__type">TEEN<br />FIESTA</span></a>
        <nav className="nav-links" aria-label="Main navigation">{links.map(link => <a key={link.href} href={link.href} aria-current={active === link.href.split("#")[1] ? "location" : undefined}>{link.label}</a>)}<a className="nav-links__cta" href="/pricing">DASH PASS <span aria-hidden="true">↗</span></a></nav>
        <button className="nav-toggle" type="button" aria-label="Open navigation menu" aria-expanded={open} aria-controls="navigation-menu" onClick={() => setOpen(true)}><span>MENU</span><span className="nav-toggle__icon" aria-hidden="true"><i /><i /></span></button>
      </div>
    </header>
    <dialog ref={dialog} id="navigation-menu" className="menu-dialog" aria-label="Navigation menu" onClose={() => setOpen(false)} onCancel={() => setOpen(false)} data-lenis-prevent>
      <div className="menu-dialog__top"><a className="wordmark" href="/#top" onClick={() => setOpen(false)} aria-label="Teen Fiesta home"><Image src="/media/teen-fiesta-monogram.png" alt="" width={48} height={48}/><span className="wordmark__type">TEEN<br />FIESTA</span></a><button className="close-control" autoFocus type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)}>CLOSE <span aria-hidden="true">×</span></button></div>
      <div className="menu-dialog__body"><nav aria-label="Expanded navigation">{links.map((link, index) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link.label}<i aria-hidden="true">↗</i></a>)}<a href="/pricing" onClick={() => setOpen(false)}><span>05</span>Dash Pass<i aria-hidden="true">↗</i></a></nav><div className="menu-dialog__art" aria-hidden="true"><SculptureFallback /></div></div>
      <div className="menu-dialog__foot"><span>MANSION, AGRA<br />31.10.2026 / 5–9 PM</span><span>TEEN FIESTA × ETC.<br />THE ROOM TURNS RED.</span></div>
    </dialog>
  </>;
}
