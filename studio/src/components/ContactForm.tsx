"use client";

import { useId, useRef, useState } from "react";
import { site } from "@/content/site";
import { Arrow } from "./SectionLabel";

const placeTypes = ["Coffee shop", "Roaster", "Bakery", "Café", "Restaurant", "Something else"];
const needs = ["New website", "Redesign", "Ordering or bookings", "Not sure yet"];
const timings = ["As soon as possible", "In 1–3 months", "In 3–6 months", "Just exploring"];

type Errors = Partial<Record<"name" | "email", string>>;

/**
 * The inquiry form, set as a café order ticket. With no backend yet, sending
 * opens the visitor's email app with everything pre-filled. Point `action`
 * at a form service (Formspree, Basin, a route handler…) to collect directly.
 */
export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Let me know what to call you.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "I’ll need an email address to reply to.";
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    const business = String(data.get("business") ?? "").trim();
    const place = data.get("place");
    const wants = data.getAll("needs");
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      business ? `Business: ${business}` : null,
      place ? `Kind of place: ${place}` : null,
      wants.length ? `Looking for: ${wants.join(", ")}` : null,
      `Timing: ${data.get("timing")}`,
      "",
      String(data.get("message") ?? ""),
    ].filter((l) => l !== null);

    const subject = `New project${business ? ` — ${business}` : ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  const field =
    "mt-2 w-full border-0 border-b border-ink/40 bg-transparent px-0 py-2 text-[1.05rem] placeholder:text-ink/40 focus:border-ink focus:outline-none focus:ring-0";

  if (sent) {
    return (
      <div className="relative bg-crema px-7 py-12 text-ink sm:px-10" role="status">
        <p className="label text-cocoa">Ticket sent to the kitchen</p>
        <p className="display mt-4 text-5xl">Thank you!</p>
        <p className="mt-4 max-w-sm leading-relaxed">
          Your email app should have opened with everything filled in. Hit send there and I’ll be in touch within two
          working days. If nothing opened, write to{" "}
          <a className="ink-link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
        <button type="button" onClick={() => setSent(false)} className="label mt-8 underline underline-offset-4">
          Start a new ticket
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="perforated relative bg-crema px-6 pb-12 pt-10 text-ink sm:px-10">
      <div className="label flex items-center justify-between border-b-2 border-dashed border-ink/40 pb-4 text-cocoa">
        <span>Ticket No. 0001</span>
        <span>Table: your place</span>
      </div>

      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="label">
            Your name <span className="text-terracotta" aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-err` : undefined}
            className={field}
            placeholder="Pilar Ortega"
          />
          {errors.name && (
            <p id={`${id}-name-err`} className="mt-2 text-sm text-terracotta">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="label">
            Email <span className="text-terracotta" aria-hidden="true">*</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
            className={field}
            placeholder="you@yourplace.com"
          />
          {errors.email && (
            <p id={`${id}-email-err`} className="mt-2 text-sm text-terracotta">
              {errors.email}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-business`} className="label">
            Business name
          </label>
          <input id={`${id}-business`} name="business" autoComplete="organization" className={field} placeholder="The place everyone should know about" />
        </div>
      </div>

      <fieldset className="mt-8">
        <legend className="label">What kind of place?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {placeTypes.map((p) => (
            <label key={p} className="cursor-pointer">
              <input type="radio" name="place" value={p} className="peer sr-only" />
              <span className="block border border-ink/40 px-3.5 py-2 text-[0.95rem] transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-crema peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta">
                {p}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="label">What do you need?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {needs.map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="checkbox" name="needs" value={n} className="peer sr-only" />
              <span className="flex items-center gap-2 border border-ink/40 px-3.5 py-2 text-[0.95rem] transition-colors hover:border-ink peer-checked:border-terracotta peer-checked:bg-terracotta peer-checked:text-crema peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta">
                {n}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-7 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor={`${id}-message`} className="label">
            Tell me about it
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={3}
            className={`${field} resize-y`}
            placeholder="What you make, what's not working, what you dream about at 5am…"
          />
        </div>
        <div>
          <label htmlFor={`${id}-timing`} className="label">
            Timing
          </label>
          <select id={`${id}-timing`} name="timing" className={`${field} cursor-pointer pr-6`} defaultValue={timings[1]}>
            {timings.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t-2 border-dashed border-ink/40 pt-6">
        <p className="label text-cocoa">Total: one good conversation</p>
        <button
          type="submit"
          className="group label inline-flex items-center gap-3 bg-ink px-6 py-4 text-crema transition-colors hover:bg-terracotta"
        >
          Send it to the kitchen
          <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}
