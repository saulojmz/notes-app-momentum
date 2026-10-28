import localFont from "next/font/local";

// Self-hosted so the site renders the same everywhere and never waits on a font CDN.

export const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin-full-normal.woff2", style: "normal", weight: "100 900" },
    { path: "../fonts/fraunces-latin-full-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const instrument = localFont({
  src: [
    { path: "../fonts/instrument-sans-latin-standard-normal.woff2", style: "normal", weight: "400 700" },
    { path: "../fonts/instrument-sans-latin-standard-italic.woff2", style: "italic", weight: "400 700" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const dmMono = localFont({
  src: [
    { path: "../fonts/dm-mono-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "../fonts/dm-mono-latin-500-normal.woff2", style: "normal", weight: "500" },
  ],
  variable: "--font-dm-mono",
  display: "swap",
});

// Used only inside the concept project screens.
export const bricolage = localFont({
  src: "../fonts/bricolage-grotesque-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
  preload: false,
});

export const gloock = localFont({
  src: "../fonts/gloock-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
  preload: false,
});
