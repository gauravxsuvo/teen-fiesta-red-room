"use client";

import { useState } from "react";
import Image from "next/image";

const links = [
  { href: "#campaign", label: "The campaign" },
  { href: "#moments", label: "The details" },
  { href: "#film", label: "In motion" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <a className="wordmark" href="#top" aria-label="Teen Fiesta home">
          <Image
            className="wordmark__seal"
            src="/media/teen-fiesta-monogram.jpg"
            alt=""
            width={48}
            height={48}
            priority
          />
          <span className="wordmark__type">
            <span>TEEN</span>
            <span>FIESTA</span>
          </span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="navigation-links"
          onClick={() => setOpen((current) => !current)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className="nav-toggle__icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
        <nav
          className={`nav-links${open ? " nav-links--open" : ""}`}
          id="navigation-links"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="nav-links__cta" href="#film" onClick={() => setOpen(false)}>
            Play the film <span aria-hidden="true">↘</span>
          </a>
        </nav>
      </div>
      <noscript>
        <style>{`.nav-toggle{display:none!important}.nav-links{display:flex!important}`}</style>
      </noscript>
    </header>
  );
}
