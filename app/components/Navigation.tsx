"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = [
  { href: "/#experience", label: "Experience" },
  { href: "/#event-details", label: "Details" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#aftermovie", label: "Film" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isPricing = pathname === "/pricing";

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`site-header${isPricing ? " site-header--solid" : ""}`}>
      <div className="site-header__inner page-shell">
        <a className="wordmark" href="/#top" aria-label="Teen Fiesta home">
          <Image className="wordmark__seal" src="/media/teen-fiesta-monogram.png" alt="" width={48} height={48} priority />
          <span className="wordmark__type"><span>TEEN</span><span>FIESTA</span></span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="navigation-links"
          onClick={() => setOpen((current) => !current)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className="nav-toggle__icon" aria-hidden="true"><i /><i /></span>
        </button>
        <nav className={`nav-links${open ? " nav-links--open" : ""}`} id="navigation-links" aria-label="Main navigation">
          {links.map((link) => <a href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          <a className="nav-links__cta" href="/pricing" onClick={() => setOpen(false)}>
            DASH pass <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
      <noscript><style>{`.nav-toggle{display:none!important}.nav-links{display:flex!important}`}</style></noscript>
    </header>
  );
}
