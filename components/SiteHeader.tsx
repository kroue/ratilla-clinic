"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { site } from "@/lib/site";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#animal-bite", label: "Animal Bite Center" },
  { href: "/#doctor", label: "Our doctor" },
  { href: "/#fees", label: "Fees" },
  { href: "/#request", label: "Request a call" },
  { href: "/#visit", label: "Visit us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1101px)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/" aria-label={`${site.name}, home`}>
          <LogoMark id="header" className="brand-mark" />
          <span className="brand-text" aria-hidden="true">
            <span className="brand-name">Ratilla</span>
            <span className="brand-sub">Medical Clinic</span>
          </span>
        </Link>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
          <span>Menu</span>
        </button>

        <nav
          className={open ? "site-nav is-open" : "site-nav"}
          id="site-nav"
          aria-label="Main"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <ul className="nav-list">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <a className="btn btn-primary btn-compact" href={site.bookingUrl} target="_blank" rel="noopener">
            Book online
          </a>
        </nav>
      </div>
    </header>
  );
}
