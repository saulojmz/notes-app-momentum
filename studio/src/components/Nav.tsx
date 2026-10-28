"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Tuck the bar away while reading downward, bring it back on any upward scroll.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Keep focus inside the open menu.
      if (e.key === "Tab" && panelRef.current) {
        const items = [toggle, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const lastItem = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastItem.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-out-soft ${
        hidden && !open ? "-translate-y-full" : ""
      } ${scrolled && !open ? "bg-paper/90 shadow-[0_1px_0_rgb(42_28_21/0.12)] backdrop-blur-md" : ""}`}
    >
      <nav aria-label="Main" className="frame flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link href="/" onClick={close} className="relative z-10 text-[2rem] leading-none" aria-label={`${site.name}, home`}>
          <Wordmark className={open ? "text-paper" : ""} />
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {site.nav.map((item, i) => (
            <li key={item.href}>
              <Link href={item.href} className="group label flex items-baseline gap-1.5">
                <span className="text-cocoa transition-colors group-hover:text-terracotta">0{i + 1}</span>
                <span className="draw-link">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/#contact"
          className="label hidden items-center gap-2.5 border border-ink px-4 py-2.5 transition-colors hover:bg-ink hover:text-paper lg:flex"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-ember" />
          </span>
          {site.availability}
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className={`label relative z-10 flex items-center gap-3 py-2 md:hidden ${open ? "text-paper" : ""}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true" className="relative block h-2.5 w-6">
            <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 flex flex-col justify-between bg-ink px-[var(--gutter)] pb-10 pt-28 text-paper md:hidden"
      >
        <ul className="space-y-1">
          {site.nav.map((item, i) => (
            <li key={item.href} className="line-mask">
              <span style={{ "--delay": `${80 + i * 70}ms` } as React.CSSProperties}>
                <Link href={item.href} onClick={close} className="display flex items-baseline gap-4 py-1 text-[clamp(3.25rem,15vw,5rem)]">
                  <span className="label text-butter">0{i + 1}</span>
                  {item.label}
                </Link>
              </span>
            </li>
          ))}
        </ul>
        <div className="space-y-4">
          <p className="label text-paper/60">Say hello</p>
          <a href={`mailto:${site.email}`} className="display block text-3xl italic text-butter">
            {site.email}
          </a>
          <p className="label flex items-center gap-2 text-paper/80">
            <span className="size-2 rounded-full bg-ember" /> {site.availability}
          </p>
        </div>
      </div>
    </header>
  );
}
