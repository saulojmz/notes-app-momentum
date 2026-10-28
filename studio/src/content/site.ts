// Everything a visitor reads about the studio itself lives here,
// so renaming the studio or changing contact details is a one-file edit.

export const site = {
  name: "Proof Studio",
  wordmark: "proof",
  founder: "Saulo Jimenez",
  role: "Designer & developer",
  location: "Austin, Texas",
  email: "hello@proofstudio.co",
  url: "https://proofstudio.co",
  description:
    "Proof is a small, independent web design studio making thoughtful websites for coffee shops, roasters, bakeries, cafés and neighborhood restaurants.",
  availability: "Taking on new projects",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Portfolio", href: "https://saulo.framer.website" },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export const audiences = [
  "Coffee shops",
  "Specialty roasters",
  "Artisan bakeries",
  "Pastry shops",
  "Neighborhood cafés",
  "Small restaurants",
  "Food & drink brands",
];
